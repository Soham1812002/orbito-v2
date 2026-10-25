---
name: architecture
description: >-
  Use this skill to understand the Orbito v2 system design, backend layered pattern, frontend 8-file module pattern, state boundaries, API contracts, and database migrations.
---

# Orbito v2 Architecture & System Design Guide

This skill explains how Orbito v2 is organized, how frontend and backend communicate, and the exact patterns to follow when adding features.

---

## 1. System Overview

```text
[ Browser / User ]
       │
       ▼
[ Vite + React Frontend SPA ]
  • Redux Toolkit: Logged-in user session only
  • TanStack React Query: All API data & caching
  • React Context: Dark theme & sidebar toggles
  • AG Grid Data Tables & React Hook Form
  • Axios Interceptor: Silent refresh queue & auto-logout
       │
       ▼ (Credentials: true, Dual httpOnly Cookies: orbito_access_token & orbito_refresh_token)
[ Node.js + Express 5 Backend API ]
  • Routes: URL matching (/v1/api/auth/login, /refresh, /logout, /me)
  • Middlewares: Cookie Parser -> Auth check -> Permission check -> Input DTO validation
  • Controllers: Thin coordinator (cookies, parse input -> call service -> send JSON)
  • Services: Token generation, rotation, family theft detection & database transactions
  • Models: Sequelize database tables & relationships (refresh_tokens)
       │
       ▼ (SQL Queries via connection pool)
[ PostgreSQL 16 Database ]
  • UUID primary keys
  • Snake_case columns & soft deletes (deleted_at)
  • Refresh token persistence with family rotation & revocation tracking
  • Migration check on boot
```

---

## 2. Backend Architecture (5-Layer Pattern)

Every request follows these 5 layers in order:

```text
Incoming Request
      ↓
1. Router        (backend/src/routes/)
      ↓
2. Middlewares   (backend/src/middlewares/)
      ↓
3. Controller    (backend/src/controllers/)
      ↓
4. Service       (backend/src/services/)
      ↓
5. Model         (backend/src/models/)
```

### Layer Roles:

1. **Router (`routes/`):** Matches URL and HTTP method (GET, POST, PUT, DELETE) and attaches middlewares. Never write business logic here.
2. **Middlewares (`middlewares/`):**
   - `authenticate`: Checks JWT token and sets `req.user`.
   - `checkPermissions`: Checks user permissions (e.g., `VIEW:USER`) or `OPERATE:ALL` SuperAdmin bypass.
   - `validateDto`: Validates request body fields using `class-validator` before the controller runs.
   - `errorHandler`: Returns standard, safe JSON error responses.
3. **Controller (`controllers/`):** Very thin. Only reads inputs from `req`, calls the service method, and sends back the JSON response. Never write SQL queries here.
4. **Service (`services/`):** Contains all business logic. Calls Sequelize models and wraps multi-table operations in database transactions (`sequelize.transaction()`).
5. **Model (`models/`):** Defines Sequelize tables with UUID primary keys, snake_case columns, and soft deletion (`deleted_at`).

---

## 3. Frontend Architecture

### 3.1 State Separation

Keep state in 3 distinct places:

1. **Client Session (Redux Toolkit):** In `frontend/src/redux/userSlice.ts`. Stores ONLY the logged-in user profile, auth token, and permissions. Never store API lists here.
2. **Server Data (TanStack React Query):** Manages ALL data fetched from the API. Automatically caches, refetches, and clears stale data after updates.
3. **UI State (React Context):** In `frontend/src/context/`. Manages visual toggles (dark/light theme, sidebar open/closed).

---

### 3.2 Clean Frontend Layer Architecture

To maintain high maintainability, code clarity, and separation of concerns, the frontend codebase strictly enforces layer separation across top-level directories:

```text
frontend/src/
├── api/             # Central REST API clients (pure Axios calls & resilient mock fallback)
├── queries/         # TanStack React Query hooks (useUserList, mutations, query keys)
├── schemas/         # Zod input validation schemas (userFormSchema, authSchema)
├── types/           # TypeScript interfaces, DTO models, and data types
├── config/          # Entity registries and static configuration matrices
├── utils/           # Shared utility functions (Axios instance, RBAC permission checks)
├── components/      # Common UI components (buttons, inputs, modals, layout, feedback)
│   ├── common/      # AppDataTable, Button, Input, Modal, common icons
│   ├── layout/      # AppLayout, Header, Sidebar, PageHeader, GlobalSearchModal
│   └── feedback/    # PageLoadingFallback, loading skeletons
└── pages/           # STRICTLY React components & UI views (no APIs, utils, or queries)
    ├── auth/        # SignInPage, ForgotPasswordPage, LinkConfirmationPage
    ├── dashboard/   # DashboardPage
    ├── users/       # EntityList, EntityForm, Entity.columns
    ├── licensing/   # LicensingHubPage, Company/User/Vehicle/Reseller License pages
    ├── maintenance/ # MaintenanceHubPage, Reminders (status/overview/form), Expenses (history/overview/form)
    ├── reports/     # ReportsLayout, ReportsNavigatorPage, views/
    ├── system-config/# SystemConfigLayout, Hub, Entity pages, AuditLogPage
    └── app-config/  # AppConfigLayout, Hub, Entity pages, MasterDataXlsPage
```

#### Core Frontend Principles:
1. **Zero `../` Relative Imports**: All internal imports across components, pages, hooks, and services must use the `@/` path alias (e.g. `@/api/users.api`, `@/types/reports.types`, `@/components/common/Button`).
2. **Components-Only in `pages/`**: No raw API callers, queries, schemas, or utility functions may live inside `pages/`. Keep `pages/` strictly for UI presentation and view coordination.
3. **Lazy Loading with Route Suspense**: All page routes are lazily loaded via `React.lazy()`. Nested layouts (`AppLayout`, `ReportsLayout`, `SystemConfigLayout`, `AppConfigLayout`) must wrap `<Outlet />` inside `<Suspense fallback={<PageLoadingFallback />}>` so that navigation transitions smoothly render skeleton loaders without unmounting header or sidebar chrome.
4. **Resilient Mock Fallback**: All API functions in `src/api/` attempt network requests first and gracefully fall back to rich in-memory mock datasets with simulated latency when the backend is offline.

### 3.3 File & Component Size Cap Rule (Max 1000 Lines)
To preserve maintainability, readability, and code-review speed:
- **Maximum Ceiling:** No file or component may exceed 1000 lines of code.
- **Component Decomposition:** React components should target `<= 400 lines`. When a page or view approaches this size, extract sub-elements (modals, toolbars, stat grids, table row renderers) into dedicated sub-component files.
- **Backend Services:** Backend business logic files should target `<= 500 lines`. Split large domains into smaller domain-specific service helpers.

---

## 4. API Communication Contracts

### 4.1 Standard List Query Parameters

All collection list endpoints accept:
```text
GET /v1/api/<entities>?page=1&limit=10&search=john&filter[isActive]=true&sortBy=createdAt&sortDir=DESC
```
- `page`: Page number (default: 1).
- `limit`: Items per page (default: 10, max: 100).
- `search`: Keyword searched across text fields.
- `filter[<field>]`: Key-value filter (e.g. `filter[isActive]=true`).
- `sortBy`: Field name (e.g. `createdAt`).
- `sortDir`: `ASC` or `DESC`.

### 4.2 Standard Response Envelopes

#### 1. Paginated List Response:
```json
{
  "items": [
    {
      "id": "c1f7a4e8-8cf3-4c91-9e7f-44eb1c28c6e2",
      "_id": "c1f7a4e8-8cf3-4c91-9e7f-44eb1c28c6e2",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "isActive": true,
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

#### 2. Create / Update / Delete Response:
```json
{
  "message": "User created successfully",
  "result": {
    "id": "c1f7a4e8-8cf3-4c91-9e7f-44eb1c28c6e2"
  }
}
```

#### 3. Validation Error Response (HTTP Status 400):
```json
{
  "error": "Validation failed",
  "errors": [
    "email must be an email",
    "firstName must be longer than or equal to 2 characters"
  ]
}
```

---

## 5. Database Migrations (Zero-Drift) & Model Conventions

- Never alter database tables using manual SQL.
- All schema changes must be written as migration files in `backend/src/migrations/`.
- Every migration runs inside a transaction and logs its name in `sequelize_meta`.
- **Pre-flight Check (`backend/src/server.ts`):** On startup, the server checks `sequelize_meta`. In production, the server refuses to start if any migration is pending, preventing database mismatch.
- **System & App Configuration Storage Pattern:** For multi-domain dynamic configuration modules, use partitioned document-store tables (`system_configs` and `app_configs`) with an indexed `module_key: VARCHAR(64)` and JSONB `data` column with soft-delete (`paranoid: true`). This decouples rapidly evolving fleet entity schemas without requiring hundreds of migration files.
- **Secondary Sub-Layout & Hub Pattern:** Complex configuration modules (e.g. Sys Config, App Config) must feature an independent sub-layout shell (`AppConfigLayout.tsx`) with a collapsible secondary navigation sidebar, category accordions, instant client-side module search, and a central Command Hub (`AppConfigHubPage.tsx`) rendering live KPI metrics and module launchpads.
- **Component Decomposition Standard:** Keep all components strictly under the 400-line ceiling by extracting modal dialogs (`AppConfigFormModal.tsx`), specialized batch tools (`MasterDataXlsPage.tsx`), and workflow inspectors (`RemoveEntityPage.tsx`).

---

## 6. Frontend Zero-Mock Policy

- **No Mock Stores in Production:** All pages and feature modules must retrieve, mutate, and persist data using TanStack React Query (`useQuery` / `useMutation`) communicating with backend REST endpoints via Axios (`apiClient`).
- **No Offline Demo Bypass Tokens:** Avoid falling back to offline tokens (e.g. `demo-jwt-offline-token`) in catch blocks; real API error messages must be captured and displayed to the user via toast notifications.
- **Dynamic Config Registration:** UI pages configuring dynamic domains (e.g. `ConfigEntityPage.tsx`) define schemas and columns locally, but all entities must be fetched and persisted to the database.

---

## 7. Alerts Management & Live Telematics Architecture (Figma Node 3024:204)

- **Backend 5-Layer Alert Stack:**
  - **Tables & Models:** `alert_rules` and `alert_logs` tables with UUID primary keys, JSONB parameters/channels/schedule columns, and soft deletion (`deleted_at`).
  - **RBAC Permissions:** `VIEW:ALERT` (incidents log, rule lists, live feed) and `MANAGE:ALERT` (create, edit, delete rules, acknowledge incidents).
  - **Transaction Boundary:** Incident acknowledgement and rule mutation execute within atomic `sequelize.transaction()` with structured audit logging.
- **Frontend Spatial Canvas & Contextual Drawers Pattern:**
  - **Fleet Telematics Live Dashboard (`/dashboard`):** Real-time asset monitoring map featuring 5 top status filter chips (`TOTAL`, `RUNNING`, `IDLE`, `STOP`, `INACTIVE`) and an in-map asset dock (`LiveVehicleSwitcher`).
  - **In-Map Slide-Over Drawers:**
    - `RecentAlertsDrawer`: In-map real-time exception feed with instant map locate and acknowledge actions.
    - `VehicleRemindersDrawer`: Contextual upcoming maintenance schedules and odometer tracking for selected assets.
    - `QuickReportsDrawer`: Immediate single-asset performance summary without navigating away from the live map.
  - **Alerts 8-File Feature Module (`/alerts`):**
    - `AlertIncidentListPage`: Full-fleet incident log with severity filtering, map navigation, and CSV export.
    - `AlertRulesListPage`: Active rule register with status toggling and management actions.
    - `AlertRuleFormPage`: 4-panel policy configuration form with schedule days and notification channel cards.

---

---

## 8. Advance Operations & Dispatch Architecture (Figma Canvas Node 676:2655)

- **Backend 5-Layer Dispatch Stack:**
  - **Tables & Models (`006_advance_operations_phase1.ts`):**
    - `route_paths`: Master transit corridors with geo coordinates, corridor buffer radius, road speed caps, and JSONB `waypoints`.
    - `route_path_allocations`: Vehicle-to-corridor binding with schedule types (daily_24_7, custom_days), departure windows, and deviation tolerances.
    - `crew_allocations`: Multi-driver pairing, attendant/cleaner assignments, shift designations, and roster date ranges.
    - `immobilizer_audits`: Electronic starter interrupt, fuel valve relay cuts, and restoration logs with diagnostic speed, battery voltage, and mandatory operator justifications.
    - `compliance_reminders`: Statutory compliance tracker for commercial insurance, fitness certificates, PUC, permits, and driver licenses with multi-channel alerts (SMS, email, web push).
  - **RBAC Permissions:** `VIEW:DISPATCH`, `MANAGE:DISPATCH`, `VIEW:COMPLIANCE`, `MANAGE:COMPLIANCE` (all covered by `OPERATE:ALL` SuperAdmin bypass).
  - **Atomic Transaction & Audit Standard:** All dispatch assignments, relay dispatches, and compliance edits execute within `sequelize.transaction()` with structured `AuditLog` records.
- **Frontend 8-File Feature Modules (`frontend/src/pages/operations/`):**
  - `routes/`: Route Corridors directory with 4 KPI metrics, search filtering, and 4-panel `RoutePathFormPage` (Identity, Caps, Coordinates, Waypoint Sequence Editor).
  - `allocations/`: Vehicle corridor allocation directory with schedule pills, departure times, and full-page `RouteAllocationFormPage`.
  - `crew/`: Driver-cleaner roster directory with pairing badges, duty chips, phone telematics, and `CrewAllocationFormPage`.
  - `immobilizer/`: Security audit log table with relay execution badges, live voltage diagnostics, and interactive `Dispatch Remote Relay Command` modal with safety certification.
  - `compliance/`: General reminders directory with document expiration countdowns, urgency badges, channel pills, and `ComplianceReminderFormPage`.
- **Navigation Integration:** Mounted under `Operations` accordion group in `navigation.config.ts` and registered in `frontend/src/routes/index.tsx`.

---

## 9. Engineering Workflow & Curated Skill Synchronization

### The Unified Implementation Workflow
Orbito v2 engineering follows a strict 6-step lifecycle orchestrated by specialized skills:
1. **Understand & Inspect:** Inspect codebase models, routes, or Figma URLs (`ui-ux-pro-max`).
2. **Grill Me (`grill-me`):** Relentless interactive interview via `ask_question` modal to resolve decision branches before planning.
3. **Plan & Review (`overengineering-review`):** Formulate plan and purge speculative abstractions, YAGNI, or unnecessary dependencies.
4. **Execute Loop (`plan-executor`):**
   - Routes **Backend** tasks to [**backend-pattern-executor**](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/backend-pattern-executor/SKILL.md) (5 layers, zero-drift migrations, DTO validation, transactions).
   - Routes **Frontend / UI** tasks to [**ui-layout-executor**](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/ui-layout-executor/SKILL.md) (tokens, 8-file pattern, `<TableFilterBar>`, `<AppDataTable>`, `<TwoLineCell>`, card padding).
   - Verifies compile checks (`npm run build`, `npm run migrate:check`) and goals after every single step until 100% completed.
5. **Verify (`playwright-qa`):** Multi-viewport browser journeys, console audits, and screenshot evidence.
6. **Curated Skill Updates:** Update necessary skills upon major changes.

### Curated Skill Synchronization Standard
- **When to update skills:** Proactively update matching `.agents/skills/` documents and `AGENTS.md` whenever introducing or modifying durable architectural conventions, new database tables/models, shared UI components (`@/components/common`), or module patterns.
- **What NOT to update:** Do NOT treat skills as git commit changelogs or task logs. Never add one-off bug fix summaries or temporary debugging instructions. ONLY record durable, repeatable standards that prevent future engineering inconsistency.

---

## 10. Infrastructure, Containerization & Synchronized Edge Defense

### 10.1 Production Container Topology
Orbito v2 runs on a streamlined multi-container Docker Compose stack on EC2:
- **`postgres` (`postgres:16-alpine`):** PostgreSQL database engine with healthchecks (`pg_isready`), persistent storage mapped to `orbito_pgdata` named volume.
- **`backend` (`node:20-alpine` multi-stage):** Express 5 REST API running on internal port `9000`, uploads directory mapped to persistent `backend_uploads` volume, depends on healthy `postgres`.
- **`frontend` (`nginx:alpine-slim` multi-stage):** Serves the pre-compiled Vite SPA and acts as the public reverse proxy on ports `80` and `4173`, routing API calls and uploads to the `backend` container.

### 10.2 Reverse Proxy & Route Segregation
Nginx terminates client HTTP traffic and handles traffic segregation:
- `/` & `/assets/*`: Serves the React SPA static assets (`Cache-Control: public, immutable` for hashed assets, `no-cache` for HTML fallback).
- `/auth/v1/api/*`: Proxies to `http://backend_api/v1/api/` with forwarded headers (`X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`).
- `/auth/uploads/*`: Proxies static and uploaded media assets to `http://backend_api/uploads/` with extended proxy timeouts (`300s`).

### 10.3 Synchronized Two-Layer Rate Limiting
To protect application availability without compromising user experience or error fidelity:
1. **Layer 1 — Nginx Network Edge (Early Drops):**
   - `api_limit`: General flood mitigation (`20 req/s`, burst `40`, `nodelay`) returning immediate HTTP 429. Protects Node.js event loops from CPU exhaustion during volumetric floods.
   - `auth_limit`: Strict brute-force protection (`5 req/min`, burst `3`, `nodelay`) applied explicitly to `location = /auth/v1/api/auth/login`.
2. **Layer 2 — Express Application Backstop (`express-rate-limit`):**
   - Scoped specifically to `/v1/api/auth/login` (`100 req / 15 min window`, equivalent to `~6.7 req/min`).
   - Acts as the semantic application layer returning structured JSON error bodies (`error: "Too many login attempts..."`) and standard `RateLimit-*` headers consumed by the frontend client.
3. **Synchronization Rationale:**
   - Layer 1 operates at the kernel/socket edge before requests ever touch Node.js memory.
   - Layer 2 provides user-friendly API responses and client throttling feedback when requests slip through or originate from legitimate clients under slower sustained bursts.

