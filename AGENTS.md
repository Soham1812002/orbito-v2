# AGENTS.md — Engineering Guide for Orbito v2

Welcome to **Orbito v2**! This guide is written in plain, simple English so that any AI agent or developer can immediately understand how this project works, how to write clean code, and how to keep it secure.

---

## 1. What is Orbito v2?

Orbito v2 is a web application made of two parts:

- **Frontend (`frontend/`):** A fast single-page app built with **React 18**, **TypeScript**, and **Vite**, styled with **TailwindCSS 4**.
- **Backend (`backend/`):** A REST API built with **Node.js 22+**, **Express 5**, and **TypeScript**, connected to a **PostgreSQL 16** database using **Sequelize 6 ORM**.
- **Database (`docker-compose.yml`):** Runs PostgreSQL 16 on port `5434`.

---

## 2. Core Rules (Never Break These)

1. **Inspect before you touch:** Read existing code and run `git status` first. Never overwrite uncommitted user work.
2. **Environment files are 100% off-limits:** NEVER open, read, edit, print, search, or create `.env*` files. Always use [`.env.example`](file:///Users/soham18/Desktop/orbito-v2/backend/.env.example) with placeholder values.
3. **Protect secrets & say NO if unsafe:** Never print, log, or commit passwords, API keys, database credentials, or tokens. Never put secrets in frontend `VITE_*` variables. If asked to expose secrets or do something unsafe with no secure option, **say NO / refuse**, explain the danger, and guide the user on how to set it safely.
4. **No destructive commands:** Never run `rm -rf`, `git reset --hard`, `git clean -fd`, force-push, or drop database tables without explicit user approval.
5. **Never weaken security:** Never disable authentication, permissions, input validation, or TypeScript checks to bypass an error.
6. **Never guess:** Check real files and run real terminal commands. Do not invent package names or file paths.
7. **Always verify:** Run `npm run build` in both backend and frontend to prove your code compiles with zero errors.
8. **Keep documentation up to date:** Whenever you add a package, route, model, or rule, update the matching skill in `.agents/skills/` before finishing.
9. **File & component line limit:** No single file or component should ever exceed 1000 lines (target <= 400 for React components, <= 500 for backend services). Decompose and modularize code into sub-components or domain helpers before reaching this ceiling.

---

## 3. Dedicated Skills (Your Knowledge Hub)

Orbito v2 has dedicated skills in the [`.agents/skills/`](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/) directory. Each skill is a focused cheatsheet. **Refer to these skills before writing code, and update them when you make changes:**

| Skill | File Link | What It Covers |
|---|---|---|
| **Tech Stack** | [tech-stack/SKILL.md](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/tech-stack/SKILL.md) | List of installed packages, versions, run scripts, dev commands, and rules for adding new libraries. |
| **Architecture** | [architecture/SKILL.md](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/architecture/SKILL.md) | How the backend layers work, how frontend state is split, the 8-file feature pattern, and API response formats. |
| **Rules** | [rules/SKILL.md](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/rules/SKILL.md) | Coding and security rules: password hashing, permissions (RBAC), input validation, database transactions, and error handling. |
| **Code Review** | [code-review/SKILL.md](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/code-review/SKILL.md) | The pre-flight checklist, build verification commands, and response format to use before completing a task. |
| **UI Layout Executor** | [ui-layout-executor/SKILL.md](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/ui-layout-executor/SKILL.md) | The standard layout system, design tokens, common utility classes, icons module, and responsive guidelines. |
| **Backend Pattern Executor** | [backend-pattern-executor/SKILL.md](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/backend-pattern-executor/SKILL.md) | The strict 5-layer backend pattern, zero-drift PostgreSQL migrations, Sequelize ORM standards, DTO validation, transactions, and seeding. |

---

## 4. Step-by-Step Workflow

Follow these 5 steps for every task:

```text
1. Understand  ->  Read files & check relevant skill in .agents/skills/
2. Plan        ->  Make a short plan of which files to create or change
3. Code        ->  Follow the backend 5 layers & frontend 8-file pattern
4. Verify      ->  Run build and typecheck commands in both workspaces
5. Update Docs ->  Update the relevant skill files in .agents/skills/
```

### Verification Commands
Always run these in terminal before finishing:
```bash
# 1. Backend compile check
cd backend && npm run build

# 2. Frontend compile & bundle check
cd frontend && npm run build

# 3. Database migration check
cd backend && npm run migrate:check
```

---

## 5. System Overview in Plain English

### 5.1 Backend: The 5 Request Layers
Every backend request travels through 5 simple steps:
1. **Router (`routes/`):** Matches the URL path. No business logic here.
2. **Middlewares (`middlewares/`):** Checks JWT login token (`authenticate`), checks permissions (`checkPermissions`), and checks inputs (`validateDto`).
3. **Controller (`controllers/`):** Thin coordinator. Reads input from request, calls the service, and sends back the JSON response.
4. **Service (`services/`):** Business logic. Reads/writes data with Sequelize and wraps multiple-table changes in a database transaction (`sequelize.transaction()`).
5. **Model (`models/`):** Table definitions with UUID primary keys, snake_case columns, and soft delete (`deleted_at`).

### 5.2 Frontend: State Separation & 8-File Feature Pattern

#### Where State Lives
- **Redux (`userSlice.ts`):** ONLY stores the logged-in user profile, token, and permissions. Never put API table lists here.
- **TanStack React Query (`Entity.queries.ts`):** Manages ALL server data (fetching, caching, auto-refreshing).
- **React Context:** Stores visual toggles like dark theme (`ThemeContext`) and sidebar collapse (`SidebarContext`).

#### The Standard 8-File Feature Pattern
When adding any feature (e.g. Users, Roles, Products), create a folder in `frontend/src/pages/<entity>/` with these 8 files:
1. `index.tsx`: One line that exports `EntityList`.
2. `EntityList.tsx`: Main page with search bar, filters, and AG Grid table.
3. `EntityForm.tsx`: Modal popup for Create, Edit, or Copy.
4. `Entity.api.ts`: Pure API calls using Axios.
5. `Entity.types.ts`: TypeScript types for the record, form data, and filters.
6. `Entity.schema.ts`: Zod validation rules for form inputs.
7. `Entity.queries.ts`: React Query hooks for fetching and mutating data.
8. `Entity.columns.tsx`: AG Grid column settings and action buttons.

---

## 6. Definition of Done & Response Format

A task is complete only when:
- [ ] Code follows the backend 5 layers and frontend 8-file pattern.
- [ ] Backend compiles cleanly (`cd backend && npm run build`).
- [ ] Frontend compiles cleanly (`cd frontend && npm run build`).
- [ ] Database migrations are checked (`cd backend && npm run migrate:check`).
- [ ] Relevant skills in [`.agents/skills/`](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/) are updated.

When reporting your completed work, use this clear format:

```markdown
### Summary
- What was done and key design decisions.

### Files Changed
- List of created or modified files and their purpose.

### Security & Reliability Review
- How authentication, permissions, input validation, and database transactions were handled.

### Verification Results
- `cd backend && npm run build`: Passed
- `cd frontend && npm run build`: Passed
- `cd backend && npm run migrate:check`: Passed

### Documentation Updates
- List which skills in `.agents/skills/` were updated.

### Next Steps / Recommendations
- Any follow-up notes for the user.
```
