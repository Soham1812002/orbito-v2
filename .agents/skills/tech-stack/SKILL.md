---
name: tech-stack
description: >-
  Use this skill to inspect, understand, and update the Orbito v2 technology stack, dependencies, scripts, dev setup, and package management rules.
---

# Orbito v2 Tech Stack & Commands Guide

This skill lists all tools, libraries, and scripts used in Orbito v2. Check here before adding any new package or running commands.

---

## 1. Quick Overview

Orbito v2 has two main workspaces:

1. **Frontend (`frontend/`):** Built with **React 18**, **TypeScript 5.7**, and **Vite 6**. Styled with **TailwindCSS 4**.
2. **Backend (`backend/`):** REST API built with **Node.js 22+**, **Express 5**, and **TypeScript 5.7**, using **PostgreSQL 16** and **Sequelize 6 ORM**.
3. **Database (`docker-compose.yml`):** Runs PostgreSQL 16 on port `5434`.

---

## 2. Frontend Libraries (`frontend/`)

| Tool / Library | Version | Plain-English Purpose |
|---|---|---|
| **Vite** | `^6.1` | Fast build tool and local development server. |
| **React** | `^18.3` | UI library for building components. |
| **TypeScript** | `~5.7` | Catches type bugs before running code. |
| **TailwindCSS** | `^4.0` | Utility CSS classes for styling. |
| **React Router DOM** | `^7.2` | Page navigation and protected route guards. |
| **TanStack React Query** | `^5.66` | Fetches, caches, and auto-refreshes API data. |
| **Redux Toolkit** | `^2.5` | Stores the logged-in user session (user details, token, permissions). |
| **React Hook Form** | `^7.54` | Fast form handling without unnecessary re-renders. |
| **Zod** | `^3.24` | Validates form fields and input rules. |
| **@hookform/resolvers**| `^3.10` | Connects Zod schemas into React Hook Form. |
| **AG Grid Community** | `^33.1` | High-performance data table with sorting and pagination. |
| **Axios** | `^1.7` | Makes HTTP API requests with auth token headers. |
| **Lucide React** | `^0.475`| Modern UI icons. |
| **React Hot Toast** | `^2.5` | Notification popups (success, error). |
| **Dayjs** | `^1.11` | Date and time formatting. |
| **i18next & react-i18next** | `^24.2 / ^15.4` | Multi-language translation support. |
| **clsx & tailwind-merge** | `^2.1 / ^3.0` | Combines Tailwind classes cleanly. |

### Frontend Commands

Run these inside `frontend/`:

```bash
# Install packages
npm install

# Start local dev server (http://localhost:3000)
npm run dev

# Check types and build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## 3. Backend Libraries (`backend/`)

| Tool / Library | Version | Plain-English Purpose |
|---|---|---|
| **Node.js** | `>= 22.x LTS` | Server JavaScript runtime. |
| **Express** | `^5.0` | Web framework for routing and handling requests. |
| **TypeScript** | `~5.7` | Type safety across backend services and routes. |
| **PostgreSQL** | `16.x` | Relational SQL database. |
| **Sequelize** | `^6.37` | ORM for database queries, models, and transactions. |
| **pg & pg-hstore** | `^8.13 / ^2.3` | PostgreSQL connection drivers. |
| **class-validator** | `^0.14` | Validates request inputs using DTO classes before controllers run. |
| **class-transformer** | `^0.5` | Transforms incoming JSON into typed DTO objects. |
| **bcrypt** | `^5.1` | Hashes passwords safely (10 salt rounds). Never stores plain text. |
| **jsonwebtoken** | `^9.0` | Creates and checks 24-hour login tokens (JWTs). |
| **express-rate-limit**| `^7.5` | Limits request speed on login to block brute-force attacks. |
| **cors** | `^2.8` | Allows frontend to talk to backend safely. |
| **dotenv** | `^16.4` | Loads environment variables at runtime. |
| **multer** | `^1.4` | Handles file uploads (images, attachments). |
| **winston & daily-rotate**| `^3.17 / ^5.0`| Writes structured daily log files instead of console.log. |
| **tsx** | `^4.19` | Fast runner for TypeScript scripts and live-reload during dev. |

### Backend Commands

Run these inside `backend/`:

```bash
# Install packages
npm install

# Start backend dev server with live reload (http://localhost:9000)
npm run dev

# Run database migrations
npm run migrate

# Check if migrations are up to date
npm run migrate:check

# Seed initial roles, permissions, and admin user
npm run seed

# Build TypeScript to JavaScript
npm run build

# Start production server
npm run start
```

---

## 4. Local Database (Docker)

```bash
# Start PostgreSQL container in background
docker compose up -d

# Stop PostgreSQL container
docker compose down
```

- **Port:** `5434`
- **Database Name:** `orbito_db` (or from `backend/.env`)

---

## 5. Rules for Adding Packages

1. **Check existing tools first:**
   - Need dates? Use `dayjs`. Do not install `moment`.
   - Need styles or icons? Use `tailwindcss` and `lucide-react`.
   - Need forms? Use `zod` and `react-hook-form`.
   - Need HTTP calls? Use `axios`.
2. **Never install at the root:** Only install in `frontend/` or `backend/`.
3. **Keep this file updated:** Whenever you install or remove a library, update this guide immediately.

---

## 6. MCP Servers & External Integrations

Configured in [`.agents/mcp_config.json`](file:///Users/soham18/Desktop/orbito-v2/.agents/mcp_config.json) (and [`.vscode/mcp.json`](file:///Users/soham18/Desktop/orbito-v2/.vscode/mcp.json)):

| Server Name | Endpoint / Type | Plain-English Purpose |
|---|---|---|
| **Figma** | `https://mcp.figma.com/mcp` (Remote SSE) | Connects Figma designs, components, and layout metadata directly to agent workflows. |

