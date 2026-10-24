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
10. **Strict 2-font rule:** Use exclusively self-hosted `Inter` for general UI and `font-mono` for telematics machine data (plates, coordinates, speeds, timestamps). Never import, configure, or use any other fonts (e.g. Poppins, Roboto, etc.), and never load fonts from Google Fonts or external CDNs.
11. **Figma & Design-to-Code Workflow:** Whenever a Figma URL is provided, always inspect it exclusively using Figma MCP (`get_figma_data`, `download_figma_images`). Never use Playwright or browser automation to inspect, navigate, or screenshot Figma design URLs when Figma MCP is connected. If Figma MCP encounters rate limits (HTTP 429) or token errors, notify the user directly to verify their Figma credentials or quota. Combine with `ui-ux-pro-max` intelligence to extract layout hierarchy, tokens, tables, and form patterns before planning and implementing.

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
| **Grill Me** | [grill-me/SKILL.md](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/grill-me/SKILL.md) | Relentless interactive interview before or during planning using `ask_question` to resolve decision trees and eliminate ambiguity. |
| **Overengineering Review** | [overengineering-review/SKILL.md](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/overengineering-review/SKILL.md) | Review code, plans, or diffs for needless complexity, replaceable dependencies, dead flexibility, and native/stdlib replacements. |
| **Plan Executor** | [plan-executor/SKILL.md](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/plan-executor/SKILL.md) | Central orchestration loop: routes backend tasks to `backend-pattern-executor` and frontend tasks to `ui-layout-executor`, verifies each step against plan & goal, and loops until 100% complete. |
| **Playwright QA** | [playwright-qa/SKILL.md](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/playwright-qa/SKILL.md) | Autonomous browser testing via Playwright MCP: scenario matrix execution, evidence screenshots, console/network audits, and UI/UX reports. |

---

## 4. Step-by-Step Workflow

Follow these 6 steps for every task:

```text
1. Understand  ->  Read files & check relevant skill in .agents/skills/
2. Grill       ->  Relentlessly interview user (via ask_question) to resolve decision trees
3. Plan        ->  Make a short plan & stress-test against overengineering (YAGNI, 0 unnecessary deps)
4. Execute     ->  Implement via plan-executor (routing backend to backend-pattern-executor & frontend to ui-layout-executor, looping & verifying each step)
5. Verify      ->  Run build, typecheck, review diff, and execute Playwright QA for UI modules
6. Update Docs ->  Update necessary skills in .agents/skills/ on major changes to prevent inconsistency
```

### 4.0 Figma Design Inspection & UI/UX Pro Max Workflow (Step 1 Sub-Process)
Whenever provided with a Figma design URL (`figma.com/design/...` or `figma.com/file/...`):
1. **Figma MCP Exclusively:** Call `get_figma_data` with the `fileKey` and target `nodeId` (and `download_figma_images` for rendered assets). Never launch Playwright browser automation or browser subagents to inspect Figma URLs when Figma MCP is connected.
2. **API Rate Limits & Authentication:** If Figma MCP encounters an HTTP 429 rate limit or authentication token issue, inform the user directly so they can check their Figma access token or plan quotas, rather than attempting browser automation.
3. **UI/UX Pro Max Intelligence:** Extract visual tokens, typography, hierarchy, interactive elements, filter toolbars, columns, and validation requirements following `.agents/skills/ui-layout-executor/SKILL.md`.
4. **Architecture Mapping:** Structure multi-screen modules into:
   - Module Hub (`/<module>`) with action cards and metric overviews.
   - Directory Lists (`/<module>/<sub-entity>`) with AG Grid, status filter chips, search, and CSV/Excel exports.
   - Dedicated Full-Page Forms (`/<module>/<sub-entity>/new`, `/<module>/<sub-entity>/:id/edit`) with `PageHeader`, card panels, and sticky bottom action bars.
5. **Sidebar Accordion Integration:** Add sub-items in `navigation.config.ts` under the relevant `NavigationGroup`.

### 4.1 When and How to Grill (Step 2)
Before writing code or finalizing a plan for any non-trivial feature, architectural shift, or ambiguous requirement, activate [**Grill Me**](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/grill-me/SKILL.md):
- **Inspect first:** Read existing codebase files, schemas, and routes so you don't ask what is already known.
- **Interactive questions only:** Always use the `ask_question` tool (modal popup with 2–4 concrete choices). Never ask questions as raw markdown text.
- **One at a time:** Ask one question per turn, acknowledge the choice in 1–2 sentences, and follow each branch of the decision tree to completion.
- **Synthesize:** Once all branches are settled, summarize decisions and proceed directly to Step 3 (Plan).

### 4.2 Overengineering Review (Step 3 & Step 5)
Apply [**Overengineering Review**](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/overengineering-review/SKILL.md) at both planning and review stages:
- **Planning Gate (Step 3):** Challenge file and layer counts before writing code. Eliminate speculative abstractions (YAGNI), reject unnecessary new dependencies when native JS/TS or existing stack tools suffice, and avoid single-caller wrapper classes.
- **Diff & Implementation Review (Step 5):** Review diffs and newly written files using tags: `delete:`, `stdlib:`, `native:`, `existing-dep:`, `yagni:`, and `shrink:`. Collapse thin local pass-throughs and remove unused state.
- **Guardrails:** Never remove security checks (`authenticate`, `checkPermissions`), input validation (`validateDto`, Zod), atomic database transactions (`sequelize.transaction()`), or baseline 5-layer/8-file architecture.

### 4.3 Playwright QA & UI/UX Audit (Step 5 Sub-Process)
Whenever adding or modifying UI screens, execute browser QA using [**Playwright QA**](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/playwright-qa/SKILL.md):
1. **Interactive Journeys:** Navigate via `browser_navigate`, locate elements via `browser_snapshot`, and execute scenarios (loads, filters, form submissions, validation triggers).
2. **Multi-Viewport Testing:** Validate layout across Desktop (`1440x900`), Tablet (`768x1024`), and Mobile (`375x667`).
3. **Evidence Capture:** Take high-resolution screenshots (`browser_take_screenshot` with `scale: 'device'`) for visual proof.
4. **Health Diagnostics:** Inspect `browser_console_messages` and `browser_network_requests` for zero runtime errors.
5. **Report Generation:** Create a structured QA artifact (`qa_report_<module>.md`) with scenario matrix, pass/fail status, and actionable UI/UX improvement recommendations.

### 4.4 Plan Executor: Orchestration & Iterative Verification Loop (Step 4 Process)
Whenever implementing an approved plan or multi-step engineering task, activate [**Plan Executor**](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/plan-executor/SKILL.md):
1. **Checklist Decomposition:** Extract plan deliverables into an explicit checklist tagged by domain (`[Backend]`, `[Frontend]`, `[UI/UX]`).
2. **Domain Skill Delegation:**
   - Route **Backend** items to [**backend-pattern-executor**](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/backend-pattern-executor/SKILL.md) (strict 5 layers: routes -> middlewares -> controllers -> services -> models, zero-drift migrations, DTO validation, transactions).
   - Route **Frontend / UI** items to [**ui-layout-executor**](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/ui-layout-executor/SKILL.md) (design tokens, `.panel-card p-4 sm:p-5`, `<TableFilterBar>`, `<AppDataTable>`, `<TwoLineCell>`, clean `PageHeader`).
3. **Verify Every Step:** After each atomic step, run immediate compile checks (`npm run build` and `npm run migrate:check`), auditing the output against the specific checklist deliverable and user goal.
4. **Iterate Continuous Loop:** Do NOT stop until 100% of checklist items and user goals are achieved and confirmed working.
5. **Curated Skill Updates on Major Changes:** Proactively update the necessary skills (`.agents/skills/`) and `AGENTS.md` whenever major architectural shifts, schema designs, or shared UI components are introduced to prevent future inconsistencies. Do NOT log trivial bugs or changelogs; ONLY record durable, repeatable standards.

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
- [ ] Requirements and decision branches clarified via grill interview (`grill-me`) before planning.
- [ ] Plan and diff reviewed for overengineering (`overengineering-review`) with zero speculative bloat.
- [ ] Code follows the backend 5 layers and frontend 8-file pattern.
- [ ] UI features verified in browser via Playwright QA (`playwright-qa`) with evidence screenshots and UI/UX report.
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
