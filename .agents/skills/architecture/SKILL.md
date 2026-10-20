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
       │
       ▼ (Bearer JWT HTTP Requests)
[ Node.js + Express 5 Backend API ]
  • Routes: URL matching
  • Middlewares: Auth check -> Permission check -> Input DTO validation
  • Controllers: Thin coordinator (parse input -> call service -> send JSON)
  • Services: Business logic & database transactions
  • Models: Sequelize database tables & relationships
       │
       ▼ (SQL Queries via connection pool)
[ PostgreSQL 16 Database ]
  • UUID primary keys
  • Snake_case columns & soft deletes (deleted_at)
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

### 3.2 The Standard 8-File Feature Pattern

Every business entity (e.g. Users, Roles, Orders) in the frontend lives in `frontend/src/pages/<entity-name>/` with exactly 8 files:

```text
frontend/src/pages/<entity-name>/
├── index.tsx          # 1. One-line router export: export { default } from "./EntityList";
├── EntityList.tsx     # 2. Page layout: Search bar, filter tags, and AG Grid table
├── EntityForm.tsx     # 3. Modal dialog: Form to Create, Edit, or Copy records
├── Entity.api.ts      # 4. Pure API functions calling Axios (list, getById, create, update, delete)
├── Entity.types.ts    # 5. TypeScript interfaces for entity, form payload, and filters
├── Entity.schema.ts   # 6. Zod validation schema for form inputs
├── Entity.queries.ts  # 7. React Query hooks (useEntityList, useCreateEntity, etc.)
└── Entity.columns.tsx # 8. AG Grid column definitions (headers, badges, action buttons)
```

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

## 5. Database Migrations (Zero-Drift)

- Never alter database tables using manual SQL.
- All schema changes must be written as migration files in `backend/src/migrations/`.
- Every migration runs inside a transaction and logs its name in `sequelize_meta`.
- **Pre-flight Check (`backend/src/server.ts`):** On startup, the server checks `sequelize_meta`. In production, the server refuses to start if any migration is pending, preventing database mismatch.

---

## 6. How and When to Update This Skill

> **Instruction:** When you add a new model, route, service, or frontend feature module, update this file so the architectural blueprint stays accurate.
