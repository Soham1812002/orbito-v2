# Orbito v2 Enterprise Monorepo Platform

An enterprise-grade, contract-driven monorepo architecture scaffolding combining **Vite + React (TypeScript)** and **Node.js + Express 5 (TypeScript)** with **PostgreSQL 16 & Sequelize 6 ORM**, built according to the specification defined in [PROJECT_ARCHITECTURE_SPEC.md](.docs/PROJECT_ARCHITECTURE_SPEC.md).

---

## Architecture Overview

```
+-----------------------------------------------------------------------------------+
|                                  Vite Frontend SPA                                |
|  React 18 | TypeScript | TailwindCSS 4 | TanStack Query 5 | Redux Toolkit         |
|  AG Grid Community | React Hook Form + Zod | React Router 7                       |
+-----------------------------------------------------------------------------------+
                                   │  ▲
                Bearer JWT HTTP/JSON │  │ Standard Envelopes & Error Codes
                                   ▼  │
+-----------------------------------------------------------------------------------+
|                                Node.js Backend API                                |
|  Node.js 22+ | Express 5 | TypeScript | Sequelize 6 ORM | class-validator DTOs    |
|  JWT Authentication | Role-Based Access Control (RBAC) | Winston Logging          |
+-----------------------------------------------------------------------------------+
                                   │
                                   ▼
+-----------------------------------------------------------------------------------+
|                             PostgreSQL Database                                   |
|  UUID PKs | Migrations (sequelize_meta) | Transactions | Snake_case Columns       |
+-----------------------------------------------------------------------------------+
```

---

## Repository Layout

```
orbito-v2/
├── .docs/
│   └── PROJECT_ARCHITECTURE_SPEC.md   # System architectural blueprint
├── backend/                           # Node.js + Express 5 + Sequelize 6
│   ├── src/
│   │   ├── configs/                   # PostgreSQL connection & Winston logger
│   │   ├── controllers/               # Thin controllers (auth, user)
│   │   ├── dtos/                      # class-validator DTOs (auth, user)
│   │   ├── middlewares/               # auth, rbac, validation, error handler
│   │   ├── migrations/                # Zero-Drift runner.ts, schemas, seed.ts
│   │   ├── models/                    # Sequelize models (User, Role, Permission, etc.)
│   │   ├── routes/                    # Express routers
│   │   ├── services/                  # Business logic & atomic transactions
│   │   ├── types/                     # Express Request augmentations
│   │   ├── utils/                     # Environment, Pagination, Route constants
│   │   ├── app.ts                     # Express pipeline
│   │   └── server.ts                  # Server entrypoint with migration guard
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                          # Vite 6 + React 18 + TailwindCSS 4
│   ├── src/
│   │   ├── components/                # Layout, AppDataTable (AG Grid), Modals, Buttons
│   │   ├── context/                   # AuthProvider, SidebarContext, ThemeContext
│   │   ├── lib/                       # Toast, TanStack Query client, listAdapter, i18n
│   │   ├── pages/                     # 8-file feature modules (users), auth, dashboard
│   │   ├── redux/                     # userSlice (session store) & typed hooks
│   │   ├── routes/                    # Declarative routes, ProtectedRoute, RouteRenderer
│   │   ├── utils/                     # Axios interceptors, permissions (OPERATE:ALL)
│   │   ├── App.tsx                    # Provider & Router container
│   │   ├── main.tsx                   # Provider tree entrypoint
│   │   └── index.css                  # TailwindCSS 4 & AG Grid quartz styles
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docker-compose.yml                 # PostgreSQL 16 container definition
└── package.json                       # Monorepo workspaces & orchestrator scripts
```

---

## Key Architectural Principles Implemented

### 1. Standard 8-File Feature Module Pattern (`frontend/src/pages/users/`)
Every business entity is isolated across 8 dedicated files:
1. `index.tsx`: Thin router re-export (`export { default } from "./EntityList"`)
2. `EntityList.tsx`: AG Grid data grid table, search bar, status filters, and action modals
3. `EntityForm.tsx`: Modal dialog using React Hook Form + Zod resolver (Create / Edit / Duplicate)
4. `Entity.api.ts`: Pure async API calls wrapping Axios and `listAdapter`
5. `Entity.types.ts`: TypeScript contracts for User entity, payloads, and filters
6. `Entity.schema.ts`: Zod validation schemas
7. `Entity.queries.ts`: TanStack Query hooks with automatic cache invalidation
8. `Entity.columns.tsx`: AG Grid column definitions with status badges and row action buttons

### 2. Strict State Separation
- **Client Session State (Redux Toolkit):** Maintained strictly for authenticated user state (`currentUser`, token).
- **UI State (React Context):** Controls layout shell toggles, dark/light themes, and modal visibility.
- **Server State (TanStack React Query):** Owns all asynchronous remote data (`staleTime: 30s`, `gcTime: 5m`, `refetchOnWindowFocus: false`).

### 3. Clean Layered Backend
`HTTP Request -> Express Router -> Middlewares (Auth, RBAC, DTO validation) -> Thin Controller -> Service -> Sequelize ORM`
- **Transactions:** Multi-table operations wrapped in `sequelize.transaction()` with automatic commit/rollback.
- **DTO Validation:** `validateDto(dtoClass)` runs class-validator before requests reach controllers.
- **Password History & Expiry:** Prohibits reuse of the last 3 passwords stored in `user_password_history`, with automatic 30-day expiration calculation.

### 4. Zero-Drift Migration Engine (`backend/src/migrations/runner.ts`)
- Migrations are sequential TypeScript files running inside isolated database transactions and recorded in `sequelize_meta`.
- **Pre-flight Guard (`checkMigrations`):** Checks for pending migrations at server boot. In production, startup halts if desynchronized migrations exist.

### 5. Standard Response Envelopes & Pagination
- List queries support standard parameters: `?page=1&limit=10&search=<term>&filter[isActive]=true&sortBy=createdAt&sortDir=DESC`
- List response: `{ "items": [...], "metadata": { "totalCount": 45, "currentPage": 1, "limit": 10, "totalPages": 5 } }`
- Normalized via `listAdapter` to `{ rows, total, page, pageSize, totalPages }` with canonical `id` and `_id`.

---

## Getting Started

### 1. Prerequisites
- **Node.js:** `>= 22.x LTS` (tested on Node 24)
- **Docker & Docker Compose** (or local PostgreSQL 16)

### 2. Start Database
```bash
docker compose up -d
```
*(PostgreSQL container runs on port `5434` as configured in `docker-compose.yml` and `backend/.env`)*

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Seed initial roles, permissions, and super admin user
npm run seed

# Start backend server (http://localhost:9000)
npm run dev
```

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server (http://localhost:3000)
npm run dev
```

---

## Seed Accounts & Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Super Admin** | `admin@example.com` | `Admin@123456` | `OPERATE:ALL` (Full system bypass) |
| **Demo User** | `user@example.com` | `User@123456` | `VIEW:USER` (Read-only user list) |

---

## Workspace Structure Reference

- **`backend/`**: Independent Node.js + Express 5 application with its own `node_modules/`, `package.json`, and `tsconfig.json`.
- **`frontend/`**: Independent Vite 6 + React application with its own `node_modules/`, `package.json`, and `tsconfig.json`.
- **Root**: Clean repository root with no hoisted dependencies.
