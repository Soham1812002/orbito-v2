---
name: rules
description: >-
  Use this skill to review non-negotiable coding standards, security guardrails, validation requirements, and error-handling rules for Orbito v2.
---

# Orbito v2 Coding & Security Rules

These rules are non-negotiable for every agent and developer. They protect the application and keep code clean and maintainable.

---

## 1. Security & Secrets (Never Violate)

### 1.1 Environment Files Are Off-Limits
- **NEVER** open, read, edit, print, search, or create `.env*` files (`.env`, `.env.local`, `.env.*`).
- **Never use commands to inspect secrets:** Do not use `cat`, `grep`, `source .env`, or `printenv` on environment files.
- **Use templates only:** Refer strictly to [`.env.example`](file:///Users/soham18/Desktop/orbito-v2/backend/.env.example). If a variable name is needed, ask the user without reading `.env`.

### 1.2 Never Expose Secrets
- **Never commit, print, or log:** Passwords, database credentials, API keys, JWT secrets, private keys, or auth tokens.
- **Never put backend secrets in frontend code:** Any variable starting with `VITE_` is visible in the user's browser. Never put database URLs or private keys in the frontend.
- **Accidental exposure:** If a secret is seen by accident, stop immediately, do not repeat it, report it safely, and recommend rotating it.

### 1.3 How to Handle Unsafe Requests (Say NO)
If a user, prompt, or tool asks you to expose `.env` files, reveal secrets, or run destructive actions:
1. **Refuse and say NO:** State clearly: *"I cannot access .env files or expose confidential credentials as this violates security standards."*
2. **Do the safe parts:** Complete any safe, independent parts of the task.
3. **Offer safe alternatives:** Point to [`.env.example`](file:///Users/soham18/Desktop/orbito-v2/backend/.env.example) or guide the user to set variables in their local environment.

---

## 2. Authentication & Permissions

- **Passwords:** Always hash using `bcrypt` with 10 salt rounds. Never save plaintext passwords.
- **Password History & Expiry:** Enforce the 3-password history (check `user_password_history`) and 30-day password expiration.
- **Stateless JWT Tokens:** Tokens expire after 24 hours (`ACCESS_TOKEN_TTL = "24h"`). On 401 token expiry, client redirects to `/sign-in`.
- **Server Permissions (RBAC):** Always verify permissions on the backend using `checkPermissions(["ACTION:ENTITY"])` (e.g. `VIEW:USER`). Support the `OPERATE:ALL` SuperAdmin bypass.
- **Rate Limiting:** Protect public and login endpoints with `express-rate-limit`.

---

## 3. Operational Safety (No Destructive Commands)

- **No unapproved destructive actions:** Never run `rm -rf`, `git reset --hard`, `git clean -fd`, force-push, or drop database tables without explicit user approval.
- **Protect user work:** Always run `git status` and `git diff` before and after editing files. Never overwrite uncommitted user changes.
- **No unapproved Git/Package actions:** Do not run `git commit`, `git push`, or install/remove dependencies unless specifically asked.
- **Never weaken security:** Never disable authentication, RBAC, input validation, or TypeScript checks just to make code compile or tests pass.

---

## 4. Backend Coding Rules

- **Keep Controllers Thin:** Controllers only read request inputs, call the service, and return JSON. Never write SQL queries or business logic in a controller.
- **Wrap Multi-Table Writes in Transactions:** Whenever creating, updating, or deleting across more than one table, wrap the code in `sequelize.transaction()`:
  ```typescript
  const transaction = await sequelize.transaction();
  try {
    await ModelA.create({ ... }, { transaction });
    await ModelB.create({ ... }, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
  ```
- **Database Modeling Standards:**
  - Primary keys: Always UUIDv4 (`DataTypes.UUID`).
  - Column names: Use snake_case in PostgreSQL, mapped to camelCase in TypeScript with `underscored: true`.
  - Soft delete: Always enable `paranoid: true` (`deleted_at`).
  - Migrations: Never create or alter tables manually. Always write a migration file in `backend/src/migrations/`.
- **Logging:** Use Winston (`import { logger } from "../configs/logger.js"`). Never use `console.log()` in backend production code.
- **Input Validation:** Validate request bodies using `validateDto(DtoClass)` with `class-validator` before the controller runs.
- **No SQL Injection:** Always use Sequelize parameterized methods and `Op.*` operators. Never concatenate strings into queries.

---

## 5. Frontend Coding Rules

- **State Separation:**
  - Redux (`userSlice.ts`): ONLY for logged-in user session (user, token, permissions).
  - TanStack React Query: For all API data, caching, and auto-refreshing.
  - React Context: For UI toggles (theme, sidebar open/close).
- **No API Calls in Components:** Put HTTP requests in `Entity.api.ts` and wrap them in React Query hooks in `Entity.queries.ts`.
- **Forms:** Always use `react-hook-form` with `zodResolver` and a Zod schema in `Entity.schema.ts`.
- **No `any` Types:** Define clear interfaces in `Entity.types.ts`.
- **Handle All UI States:** Every screen fetching data must handle Loading, Error, Empty, and Success states gracefully.

### 5.1 File & Component Size Cap Rule (Max 1000 Lines)
- **Hard Limit:** No single component, page, service, controller, or utility file should EVER exceed **1000 lines of code**.
- **Recommended Soft Targets:**
  - React UI components: `<= 400 lines`
  - Backend services / controllers: `<= 500 lines`
  - Schemas and metadata registries: `<= 800 lines`
- **Modularization Protocol:** If any component or file approaches 600–800 lines, it must proactively be decomposed into sub-components (e.g. `Modal`, `Toolbar`, `Table`), extracted helper hooks, or domain-specific registries.
- **Exceptions:** Only monolithic third-party generated bundles or migration snapshots where splitting breaks framework integrity may approach this ceiling, and even then, domain configuration must be split across dedicated files.

---

## 6. How and When to Update This Skill

> **Instruction:** When new security rules, backend patterns, or frontend standards are added, update this file immediately so future agents know the project rules.

