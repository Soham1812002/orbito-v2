# Architecture & Technical Blueprint: Vite Frontend + Node.js Backend Framework

> **Document Version:** 1.0.0  
> **Target Audience:** Engineering Team / System Architects  
> **Purpose:** Reusable, enterprise-grade architectural blueprint extracted from the LMIS platform, designed to bootstrap any new project using **Vite + React (TypeScript)** and **Node.js + Express (TypeScript)**.

---

## Table of Contents

1. [Architectural Overview & Design Principles](#1-architectural-overview--design-principles)
2. [Technology Stack & Dependency Matrix](#2-technology-stack--dependency-matrix)
3. [Vite + React Frontend Architecture](#3-vite--react-frontend-architecture)
   - [3.1 Provider Tree Hierarchy](#31-provider-tree-hierarchy)
   - [3.2 State Separation Principle](#32-state-separation-principle)
   - [3.3 Standard 8-File Feature Module Pattern](#33-standard-8-file-feature-module-pattern)
   - [3.4 Declarative Routing & RBAC Guards](#34-declarative-routing--rbac-guards)
   - [3.5 Network Layer & Axios Interceptors](#35-network-layer--axios-interceptors)
   - [3.6 Data Grid & Form System](#36-data-grid--form-system)
4. [Node.js + Express Backend Architecture](#4-nodejs--express-backend-architecture)
   - [4.1 Clean Layered Architecture](#41-clean-layered-architecture)
   - [4.2 Database Modeling & Conventions](#42-database-modeling--conventions)
   - [4.3 Zero-Drift Migration Engine](#43-zero-drift-migration-engine)
   - [4.4 DTO Validation Layer](#44-dto-validation-layer)
   - [4.5 Authentication, Passwords & RBAC](#45-authentication-passwords--rbac)
   - [4.6 Centralized Error Handling](#46-centralized-error-handling)
5. [Frontend-Backend Communication Contracts](#5-frontend-backend-communication-contracts)
   - [5.1 Standard List Pagination & Filtering Protocol](#51-standard-list-pagination--filtering-protocol)
   - [5.2 Standard Response Envelopes](#52-standard-response-envelopes)
6. [New Project Scaffolding & Setup Guide](#6-new-project-scaffolding--setup-guide)
   - [6.1 Workspace Layout](#61-workspace-layout)
   - [6.2 Production Configuration Templates](#62-production-configuration-templates)

---

## 1. Architectural Overview & Design Principles

The architecture follows a decoupled, contract-driven client-server model:

```
+-----------------------------------------------------------------------------------+
|                                  Vite Frontend SPA                                |
|  React 18/19 | TypeScript | TailwindCSS 4 | TanStack Query 5 | Redux Toolkit       |
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

### Core Principles

1. **Strict State Isolation:** Client session data resides in Redux/Context; asynchronous server data is exclusively managed by TanStack Query.
2. **Standardized Colocated Modules:** Every business entity in the frontend is encapsulated within an 8-file structure isolating types, queries, APIs, schemas, columns, forms, and views.
3. **Layered Backend Separation:** Routes pass through DTO validation and RBAC middlewares into thin controllers, delegating business logic and database transactions to dedicated services.
4. **Stateless Fine-Grained RBAC:** Access rights are represented as `ACTION:ENTITY` strings (e.g., `VIEW:USER`, `CREATE:ROLE`), backed by an administrative `OPERATE:ALL` bypass on both frontend and backend.
5. **Zero-Drift Database Migrations:** Programmatic TypeScript migrations run inside transactions at startup and are checked via pre-flight database synchronization guards.

---

## 2. Technology Stack & Dependency Matrix

### Frontend Ecosystem

| Package / Tool | Version | Role in Architecture | Key Rationale |
|---|---|---|---|
| **Vite** | `^6.3` | Build tool & Dev Server | Ultra-fast HMR and optimized production bundling. |
| **React** | `^18.3` (or 19.x) | Component Framework | Component lifecycle, hooks, and `Suspense` lazy-loading. |
| **TypeScript** | `~5.7` | Static Type Checker | End-to-end interface contracts between UI and API. |
| **TailwindCSS** | `^4.1` | Styling System | Utility-first styling via `@tailwindcss/vite` plugin. |
| **React Router DOM** | `^7.5` | Client Routing | Declarative routing with recursive permission-protected guards. |
| **TanStack React Query** | `^5.x` | Server State Management | Query caching, deduplication, invalidation, and abort cancellation. |
| **Redux Toolkit** | `^2.8` | Client State Store | Restricted to holding the authenticated user session (`userSlice`). |
| **React Hook Form** | `^7.56` | Form Management | High-performance uncontrolled form state. |
| **Zod** | `^3.24` | Schema Validation | Type-safe runtime validation paired with Hook Form resolvers. |
| **AG Grid Community** | `^35.2` | Data Grid | Virtualized grid rendering for large datasets with server pagination. |
| **Axios** | `^1.9` | HTTP Client | Request/response interceptors for Bearer auth and global error handling. |
| **Day.js** | `^1.11` | Date Manipulation | Lightweight, immutable date formatting. |
| **react-hot-toast** | `^2.5` | Notification Toasts | Global notification feedback triggered directly from API interceptors. |
| **i18next** | `^25.1` | Internationalization | Multi-language localization support. |

### Backend Ecosystem

| Package / Tool | Version | Role in Architecture | Key Rationale |
|---|---|---|---|
| **Node.js** | `>= 22.x LTS` | Runtime Environment | Modern LTS JavaScript/TypeScript runtime. |
| **Express** | `^5.1` | Web Framework | Lightweight middleware pipeline with native async error handling. |
| **PostgreSQL** | `16.x` | Relational Database | ACID guarantees, native UUIDs, arrays, and relational indexing. |
| **Sequelize** | `^6.37` | ORM | Connection pooling, relational mapping, hooks, and transactions. |
| **class-validator** | `^0.14` | Request Validation | Decorator-based DTO validation executed before controllers. |
| **class-transformer** | `^0.5` | Object Transformation | Serializes raw JSON payloads into validated class instances. |
| **jsonwebtoken** | `^9.0` | Authentication | Cryptographic signing and verification of stateless Bearer tokens. |
| **bcrypt** | `^5.1` | Password Security | 10-round salted password hashing. |
| **express-rate-limit** | `^7.5` | Security Middleware | Rate-limiting sensitive endpoints against brute force. |
| **Multer** | `^2.0` | File Handling | Multipart/form-data upload handling (signatures, attachments). |
| **Winston** | `^3.17` | Structured Logging | Daily file rotation with separation of application and error logs. |

---

## 3. Vite + React Frontend Architecture

### 3.1 Provider Tree Hierarchy

The application entrypoint (`src/main.tsx`) composes providers in strict dependency order:

```
Provider (Redux: userSlice)
  └── QueryClientProvider (TanStack React Query)
      └── ThemeProvider (Dark / Light Theme Tokens)
          └── ToastProvider (react-hot-toast Container)
              └── I18nextProvider (Localization Context)
                  └── GlobalContextProvider (Custom Compound Contexts)
                      └── App
                          └── BrowserRouter
                              └── Suspense (Code-Splitting Fallback)
                                  └── AuthProvider (Validates session on mount)
                                      └── RouteRenderer (Renders route tree with RBAC guards)
```

---

### 3.2 State Separation Principle

- **Client Session State (Redux Toolkit):** Maintained strictly for authenticated user state (`currentUser`). No API list or detail data is stored here.
- **UI State (React Context):** Controls layout shell toggles, dark/light themes, and modal visibility.
- **Server State (TanStack React Query):** Owns all asynchronous remote data. Configured with:
  - `staleTime: 30_000` (30 seconds before marked stale)
  - `gcTime: 300_000` (5 minutes of memory retention)
  - `refetchOnWindowFocus: false`
  - Automatic request cancellation via `AbortSignal`.

---

### 3.3 Standard 8-File Feature Module Pattern

Any new entity or business domain module in the frontend is structured across **8 specialized files**:

```
src/pages/<entity-name>/
├── index.tsx              # 1. Thin router re-export: export { default } from "./EntityList"
├── EntityList.tsx         # 2. Main list container: AG Grid table, toolbar, search, action modal triggers
├── EntityForm.tsx         # 3. Form dialog: React Hook Form + Zod for Create / Edit / Copy
├── Entity.api.ts          # 4. Pure API functions: wraps Axios and listAdapter
├── Entity.types.ts        # 5. TypeScript interfaces: Entity, Payload, Filters
├── Entity.schema.ts       # 6. Zod validation schema: Form field validation rules
├── Entity.queries.ts      # 7. React Query hooks: useQuery and useMutation with cache invalidation
└── Entity.columns.tsx     # 8. AG Grid column factory: headers, formatters, and action buttons
```

#### Responsibilities of the 8 Files:

1. **`Entity.types.ts`**: Defines the data model, create/update payloads, and query filters.
2. **`Entity.schema.ts`**: Defines Zod validation schemas and infers form value types.
3. **`Entity.api.ts`**: Pure async functions calling Axios. Uses `listAdapter` to format query params and unpack server envelopes.
4. **`Entity.queries.ts`**: Defines hierarchical query key factories (`entityKeys.all`, `entityKeys.list(params)`, `entityKeys.detail(id)`), custom hooks (`useEntityList`), and mutation hooks with automatic cache invalidation (`queryClient.invalidateQueries`).
5. **`Entity.columns.tsx`**: Column definitions for AG Grid, including custom badges, date formatters, and row action triggers.
6. **`EntityForm.tsx`**: Modal dialog using `react-hook-form` with `zodResolver`. Handles create, update, and duplicate modes.
7. **`EntityList.tsx`**: Coordinates the page view: manages search/pagination state, triggers mutations, and renders the data table.
8. **`index.tsx`**: One-line re-export of `EntityList` for lazy-loaded route declarations.

---

### 3.4 Declarative Routing & RBAC Guards

Routes are defined as a typed hierarchical tree:

```typescript
export interface AppRoute {
  path: string;
  element: React.ReactNode;
  children?: AppRoute[];
  protection?: {
    requiredPermission?: string;
    requiredRole?: string;
  };
  meta?: {
    title: string;
    icon?: string;
    hideFromMenu?: boolean;
  };
}
```

- **`RouteRenderer.tsx`**: Recursively traverses the tree and wraps protected routes inside `<ProtectedRoute />`.
- **`<ProtectedRoute />`**: Inspects `user.roles` permissions via `hasPermission(user, requiredPermission)`. If unauthorized, renders a fallback or redirects to `/sign-in`.

---

### 3.5 Network Layer & Axios Interceptors

Axios is configured with centralized request and response interceptors:

1. **Request Interceptor:**
   - Reads the token from `sessionStorage` (or `localStorage`) and adds the `Authorization: Bearer <token>` header.
2. **Response Interceptor:**
   - **Canceled Query Suppression:** Ignores `error.code === "ERR_CANCELED"` so unmounting queries or closed modals do not trigger error states.
   - **Token Expiry Trapping:** Detects status 401 with `{ message: "Token Expired" }`, purges credentials, and redirects to `/sign-in`.
   - **Global Error Toasts:** For unexpected errors (excluding intentional 404s), extracts the message and invokes `toast(message, "error")`.

---

### 3.6 Data Grid & Form System

- **Data Grid (`AppDataTable.tsx`):** Wraps AG Grid Community. Provides built-in search filtering, sorting, selection check-boxes, and a server-side pagination footer.
- **List Adapter (`listAdapter.ts`):** Normalizes backend envelopes into a consistent `{ rows, total, page, pageSize, totalPages }` shape and ensures canonical ID resolution (`id` and `_id`).

---

## 4. Node.js + Express Backend Architecture

### 4.1 Clean Layered Architecture

```
HTTP Request
     │
     ▼
[ Express Router ]          (Matches URL, binds middlewares)
     │
     ▼
[ Middlewares ]             (authenticate -> checkPermissions -> validateDto)
     │
     ▼
[ Controller ]              (Thin: extracts inputs -> calls service -> returns JSON)
     │
     ▼
[ Service ]                 (Business logic, data mapping, multi-table transactions)
     │
     ▼
[ Sequelize Model / Repo ]  (PostgreSQL queries, hooks, associations)
```

- **Controllers are thin:** They do not execute SQL or contain business decisions.
- **Services manage transactions:** Multi-table operations are wrapped in `sequelize.transaction()` with explicit commit and rollback handling.
- **Models define data persistence:** Column names use `underscored: true` with snake_case columns mapped to camelCase TypeScript properties.

---

### 4.2 Database Modeling & Conventions

- **Primary Keys:** UUIDv4 (`DataTypes.UUID`, `defaultValue: DataTypes.UUIDV4`).
- **Timestamps:** Automatic `created_at` and `updated_at`.
- **Soft Deletion:** Models utilize `paranoid: true` (`deleted_at`), ensuring records are never hard deleted accidentally.
- **Normalization Hooks:** Models normalize fields upon write (e.g., lowercasing and trimming emails).

---

### 4.3 Zero-Drift Migration Engine

The backend utilizes a programmatic TypeScript migration runner (`runner.ts`):
- Migrations are sequential TypeScript files exporting an `up(queryInterface, DataTypes)` function.
- Applied migrations are recorded in the `sequelize_meta` table.
- Each migration runs inside an isolated PostgreSQL transaction.
- **Sync Check Guard (`checkMigrations`):** Compares the code's migration list against `sequelize_meta`. If pending migrations exist, startup halts, preventing deployment of desynchronized code.

---

### 4.4 DTO Validation Layer

Incoming payloads are validated before reaching controllers using `class-validator` and `class-transformer`:

```typescript
export const validateDto = (dtoClass: any, type: "body" | "query" | "params" = "body") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const source = req[type];
    // Supports multipart/form-data where JSON is passed as a stringified "data" field
    const payload = typeof source?.data === "string" ? JSON.parse(source.data) : source;
    const dtoObject = plainToInstance(dtoClass, payload);
    const errors = await validate(dtoObject, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      const messages = errors.map((e) => Object.values(e.constraints || {}).join(", "));
      return res.status(400).json({ error: "Validation failed", errors: messages });
    }
    req[type] = dtoObject;
    next();
  };
};
```

---

### 4.5 Authentication, Passwords & RBAC

1. **Password Security:**
   - Hashed using `bcrypt` (10 salt rounds).
   - Password reuse check: Prohibits reuse of the user's last 3 password hashes stored in `user_password_history`.
   - Automatic 30-day expiration calculation.
2. **Stateless JWT Tokens:**
   - Signed with `ACCESS_TOKEN_TTL = "24h"`.
   - Verified in `authenticate` middleware, hydrating `req.user` with attached roles and permissions.
   - If expired, responds with status **401** and `{ message: "Token Expired" }`.
3. **RBAC Engine:**
   - Permissions formatted as `ACTION:ENTITY` (e.g., `VIEW:USER`, `UPDATE:ROLE`).
   - `checkPermissions(["ACTION:ENTITY"])` verifies permissions or checks if the user possesses the `OPERATE:ALL` SuperAdmin bypass.

---

### 4.6 Centralized Error Handling

All unhandled errors propagate to Express's global error middleware, mapping database errors to standard HTTP responses:
- `SequelizeUniqueConstraintError` → Status 400 (`"Duplicate value for field {field}"`)
- `SequelizeForeignKeyConstraintError` → Status 400 (`"Foreign key constraint violation"`)
- `SequelizeValidationError` → Status 400 (Aggregated field validation messages)
- `TokenExpiredError` → Status 401 (`{ message: "Token Expired" }`)
- Default Error → Status 500 (`{ message: "Internal Server Error" }`)

---

## 5. Frontend-Backend Communication Contracts

### 5.1 Standard List Pagination & Filtering Protocol

Clients query paginated collections using standard URL query parameters:
```
GET /v1/api/<entities>?page=1&limit=10&search=<term>&filter[<field>]=<value>&sortBy=<column>&sortDir=asc
```

The backend parses parameters via `pagination.util.ts`:
- `page`: 1-based page number (default: 1)
- `limit`: items per page (default: 10, max: 100)
- `skip`: derived offset `(page - 1) * limit`
- `search`: term applied to indexed text columns via `Op.iLike`
- `filter`: whitelisted key-value filters

---

### 5.2 Standard Response Envelopes

#### Enveloped List Response
```json
{
  "items": [
    {
      "id": "c1f7a4e8-8cf3-4c91-9e7f-44eb1c28c6e2",
      "_id": "c1f7a4e8-8cf3-4c91-9e7f-44eb1c28c6e2",
      "name": "Sample Entity",
      "status": "active",
      "createdAt": "2026-03-10T12:00:00.000Z",
      "updatedAt": "2026-03-10T12:00:00.000Z"
    }
  ],
  "metadata": {
    "totalCount": 45,
    "currentPage": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Mutation Response (Create / Update / Delete)
```json
{
  "message": "Entity created successfully",
  "result": { "id": "c1f7a4e8-8cf3-4c91-9e7f-44eb1c28c6e2" }
}
```

#### Validation Error Response (Status 400)
```json
{
  "error": "Validation failed",
  "errors": [
    "email must be an email",
    "name must be longer than or equal to 2 characters"
  ]
}
```

---

## 6. New Project Scaffolding & Setup Guide

### 6.1 Workspace Layout

For the new project, adopt either a monorepo or two sibling directories:

```
new-project/
├── backend/                  # Node.js + Express 5 + Sequelize 6
│   ├── src/
│   │   ├── configs/          # Database, Logger
│   │   ├── controllers/      # Thin controllers
│   │   ├── dtos/             # class-validator DTOs
│   │   ├── middlewares/      # Auth, RBAC, Validation, Error
│   │   ├── migrations/       # TypeScript migration files + runner.ts
│   │   ├── models/           # Sequelize models
│   │   ├── routes/           # Express routers
│   │   ├── services/         # Business logic & transactions
│   │   ├── types/            # TypeScript type augmentations
│   │   ├── utils/            # Environment, Pagination, Route constants
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Vite 6 + React 18/19 + TailwindCSS 4
│   ├── src/
│   │   ├── components/       # Layout, AppDataTable, Modals, Form primitives
│   │   ├── context/          # AuthProvider, SidebarContext, ThemeContext
│   │   ├── lib/              # Toast, TanStack Query client & listAdapter
│   │   ├── pages/            # 8-file feature modules
│   │   ├── redux/            # userSlice & store
│   │   ├── routes/           # RouteRenderer, index.tsx, types
│   │   ├── utils/            # Axios interceptors, permissions
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── docker-compose.yml        # PostgreSQL 16 local database
```

---

### 6.2 Production Configuration Templates

#### `docker-compose.yml` (Local Database)
```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: app_password
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

#### `backend/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### `frontend/vite.config.ts`
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 3000,
    proxy: {
      "/v1/api": {
        target: "http://localhost:9000",
        changeOrigin: true
      }
    }
  }
});
```
