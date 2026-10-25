---
name: deployment
description: >-
  Use this skill for all deployment, CI/CD, Docker, Nginx, and EC2 operations in Orbito v2. Covers multi-stage Dockerfiles, Docker Compose production topology, GitHub Actions automation, zero-downtime container updates, zero-drift PostgreSQL migrations, and two-layer synchronized rate limiting.
---

# Orbito v2 Deployment & Infrastructure Guide

This skill documents the complete deployment architecture, CI/CD pipeline, Docker containerization, Nginx edge configuration, and operational runbooks for Orbito v2.

---

## 1. System Topology & Architecture

Orbito v2 is deployed on AWS EC2 using a streamlined Docker Compose multi-container stack:

```text
[ Internet / Client Browser ]
             │
             │ HTTP (Ports 80 & 4173)
             ▼
┌─────────────────────────────────────────────────────────────┐
│ frontend container (nginx:alpine-slim)                      │
│                                                             │
│ • Serves React SPA static files (/ & /assets/*)             │
│ • Layer 1 Rate Limiter:                                     │
│     - api_limit (20 req/s, burst 40)                        │
│     - auth_limit (5 req/min, burst 3 on login)              │
│ • Reverse proxies /auth/v1/api/* & /auth/uploads/*          │
└────────────────────────────┬────────────────────────────────┘
                             │ Internal Docker Network (backend:9000)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ backend container (node:20-alpine)                          │
│                                                             │
│ • Express 5 REST API (Port 9000)                            │
│ • Layer 2 Rate Limiter (express-rate-limit):                │
│     - 100 req / 15 min on /v1/api/auth/login                │
│     - Returns JSON error body + RateLimit-* headers         │
│ • Uploads volume: backend_uploads (/app/uploads)            │
└────────────────────────────┬────────────────────────────────┘
                             │ Internal Docker Network (postgres:5432)
                             ▼
┌─────────────────────────────────────────────────────────────┐
│ postgres container (postgres:16-alpine)                     │
│                                                             │
│ • PostgreSQL 16 Relational Database                         │
│ • Persistent Volume: orbito_pgdata                          │
│ • Healthcheck: pg_isready -U ${POSTGRES_USER} -d ${DB_NAME} │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Docker Containerization Standards

### 2.1 Backend Dockerfile (`backend/Dockerfile`)
Uses a 3-stage multi-stage build:
1. **`deps` stage:** Installs production dependencies with `npm ci --omit=dev`.
2. **`builder` stage:** Installs all dependencies and compiles TypeScript into `dist/` via `npm run build`.
3. **`runner` stage:** Minimal production image based on `node:20-alpine`, copying only `node_modules` from `deps` and `dist/` from `builder`. Runs as the unprivileged `node` user with an exposed port of `9000`.

### 2.2 Frontend Dockerfile (`frontend/Dockerfile`)
Uses a 2-stage multi-stage build:
1. **`builder` stage:** Installs dependencies and bakes build-time `VITE_*` API base URLs into the Vite production bundle (`npm run build`).
2. **`runner` stage:** Base image `nginx:alpine-slim`, copies pre-compiled assets into `/usr/share/nginx/html` and custom configuration into `/etc/nginx/conf.d/app.conf`. Exposes ports `80` and `4173`.

---

## 3. Two-Layer Synchronized Rate Limiting

Rate limiting is coordinated between the network edge (Nginx) and application level (Express) to balance resilience with user experience:

| Attribute | Layer 1: Nginx Edge (`frontend/nginx/app.conf`) | Layer 2: Express App (`backend/src/app.ts`) |
|---|---|---|
| **Location** | Network edge (before Node.js event loop) | Application middleware (inside Node.js) |
| **Login Zone** | `auth_limit: 5 req/min, burst 3, nodelay` | `100 req / 15 min (~6.7 req/min)` |
| **API Zone** | `api_limit: 20 req/s, burst 40, nodelay` | Route-specific if configured |
| **Response** | HTTP 429 Plain Status | HTTP 429 JSON `{ error: "Too many attempts..." }` + `RateLimit-*` headers |
| **Primary Goal** | Protect Node.js process from volumetric floods | Friendly error bodies & granular client feedback |

---

## 4. GitHub Actions CI/CD Pipeline

The `.github/workflows/` directory contains 5 automated workflows:

| Workflow | File | Trigger | Purpose |
|---|---|---|---|
| **PR Checks** | `pr-checks.yml` | Pull request to `development` | Validates TypeScript typecheck and compilation for both backend and frontend. |
| **Backend CI/CD** | `backend.yml` | Push to `development` (`backend/**`, `docker-compose.yml`) | Builds & pushes Docker Hub image, runs migrations via SSH on EC2, and replaces backend container (`--no-deps`). |
| **Frontend CI/CD** | `frontend.yml` | Push to `development` (`frontend/**`, `docker-compose.yml`) | Builds & pushes Docker Hub image with Vite build-args, replaces frontend container on EC2 (`--no-deps`). |
| **Database Migrations** | `migrations.yml` | `workflow_dispatch` (manual) | Runs `npm run migrate` or `npm run migrate:check` on EC2 against target environment. |
| **EC2 Docker Cleanup** | `cleanup.yml` | Automatically after CI/CD success or `workflow_dispatch` | Executes `docker system prune -af` on EC2 to keep disk usage lean. |

---

## 5. EC2 Host Setup & Environment Configuration

### 5.1 Host Directory Structure
```text
~/orbito/
├── docker-compose.yml
├── .env                  # Secret environment file (NEVER committed to git)
└── .env.example          # Public committed reference template
```

### 5.2 Required GitHub Secrets
Configure the following secrets in GitHub Repository Settings -> Secrets and variables -> Actions:
- `DOCKERHUB_USERNAME`: Docker Hub user or organization name.
- `DOCKERHUB_TOKEN`: Docker Hub Personal Access Token with read/write access.
- `EC2_HOST`: Public IP or DNS of the EC2 instance.
- `EC2_USERNAME`: SSH username (e.g. `ubuntu` or `ec2-user`).
- `EC2_SSH_KEY`: Private SSH key matching the instance's authorized keys.
- `VITE_API_BASE_URL`: Optional frontend build-arg override (defaults to `/auth/v1/api`).

### 5.3 Secret Guardrails
- **Zero `.env` In Git:** `.env*` files are strictly excluded via `.gitignore`.
- **Placeholder Values:** Only maintain `.env.example` in repository commits.
- **Persistent Data:** Never delete or alter `orbito_pgdata` or `backend_uploads` volumes without explicit user approval.

### 5.4 Automated EC2 Bootstrap Script (`deploy/ec2-bootstrap.sh`)
When launching new EC2 instances (via AWS Console, Launch Template, or Auto Scaling Group), supply [`deploy/ec2-bootstrap.sh`](file:///Users/soham18/Desktop/orbito-v2/deploy/ec2-bootstrap.sh) in the **User data** field:
- **System Preparation:** Automatically provisions a 2GB swapfile, installs Docker Engine + Compose plugin, configures Docker log rotation (50MB cap), and adds `ubuntu` / `ec2-user` to the `docker` group.
- **Security & Port Guardrails:** Automatically configures UFW firewall rules to allow ports `22` (SSH), `80` (HTTP), `443` (HTTPS), and `4173`, while explicitly blocking external access to internal database (`5432`) and backend (`9000`) ports.
- **Health Utility:** Installs `/usr/local/bin/orbito-healthcheck` for fast terminal inspection of Docker daemon status, container health, HTTP 200 checks (`/auth/v1/api/health`), and disk/memory utilization.
- **Execution Log:** Inspect bootstrap progress in real-time or post-launch at `/var/log/orbito-bootstrap.log`.

---

## 6. Operational Runbooks

### 6.1 Checking Stack Health on EC2
```bash
# Connect to EC2
ssh -i key.pem <user>@<ec2-host>
cd ~/orbito

# View running containers and health status
docker compose ps

# View real-time logs for backend or frontend
docker compose logs -f --tail=100 backend
docker compose logs -f --tail=100 frontend
```

### 6.2 Manual Database Migrations on EC2
```bash
cd ~/orbito

# Check migration synchronization (zero-drift check)
docker compose exec backend npm run migrate:check

# Run pending migrations inside the container
docker compose exec backend npm run migrate
```

### 6.3 Zero-Downtime Service Restart
```bash
cd ~/orbito

# Pull latest images
docker compose pull backend frontend

# Recreate single service without disrupting database or other services
docker compose up -d --no-deps backend
docker compose up -d --no-deps frontend
```

### 6.4 Disk Maintenance
```bash
# Safe prune of unused dangling images and stopped containers
docker system prune -af

# Check available disk space
df -h /
```
