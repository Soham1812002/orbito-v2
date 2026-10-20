---
name: code-review
description: >-
  Use this skill to run pre-flight code reviews, verify security and architecture standards, execute verification build commands, and ensure documentation is updated before completing any task.
---

# Orbito v2 Code Review & Verification Runbook

Run this self-review before marking any task as complete. This ensures your code is clean, secure, and working.

---

## 1. Pre-Flight Checklist

### 1.1 Security
- [ ] **Permissions:** Does every protected endpoint check permissions with `checkPermissions([PERMISSIONS.XYZ])`?
- [ ] **Input Validation:** Are inputs validated using `validateDto` on the backend and Zod on the frontend?
- [ ] **No SQL Injection:** Are queries parameterized using Sequelize methods? No string concatenation.
- [ ] **Passwords:** Are passwords hashed with bcrypt (10 rounds)? Are 3-password history and 30-day expiry enforced?
- [ ] **Environment Files:** Did you ensure NO `.env*` files were read, edited, printed, or created?
- [ ] **No Exposed Secrets:** Are API keys, database credentials, and tokens kept out of code, logs, and frontend `VITE_*` variables?
- [ ] **Refusal Check:** If asked to expose secrets or run destructive commands, did you say NO and provide safe alternatives?

### 1.2 Architecture & Quality
- [ ] **Thin Controllers:** Are controllers thin and business logic kept in services?
- [ ] **Transactions:** Are multi-table writes wrapped in `sequelize.transaction()`?
- [ ] **Frontend 8-File Pattern:** Did you follow the 8-file structure in `frontend/src/pages/<entity>/`?
- [ ] **State Boundaries:** Is Redux used *only* for the logged-in session, and React Query used for API data?
- [ ] **No API Calls in JSX:** Are API calls kept in `Entity.api.ts` and React Query hooks?
- [ ] **Protected User Work:** Did you run `git status` and `git diff` to make sure no user work was overwritten?
- [ ] **No Destructive Commands:** Did you avoid running `rm -rf`, `git reset --hard`, or dropping tables?
- [ ] **No `any` Types:** Are all TypeScript types explicit?
- [ ] **Clean Logging:** Are logs using Winston (`logger.info` / `logger.error`) instead of `console.log`?

---

## 2. Mandatory Verification Commands

Run these terminal commands to prove your changes compile without bugs:

```bash
# 1. Check backend compiles
cd backend && npm run build

# 2. Check frontend compiles & bundles
cd frontend && npm run build

# 3. Check database migrations
cd backend && npm run migrate:check

# 4. Review git diff for unwanted edits or secrets
git status
git diff
```

---

## 3. Documentation Update Check

Ask yourself before finishing:
1. Did I change packages? -> Update [tech-stack/SKILL.md](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/tech-stack/SKILL.md)
2. Did I add routes, models, or pages? -> Update [architecture/SKILL.md](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/architecture/SKILL.md)
3. Did I add or change rules? -> Update [rules/SKILL.md](file:///Users/soham18/Desktop/orbito-v2/.agents/skills/rules/SKILL.md)
4. **Skill Curation Rule:** Did I record ONLY durable architectural standards, reusable conventions, and rules? (Never dump one-off bug fixes, commit notes, or task histories into skills).

---

## 4. Final Response Template

Report completed work using this clear format:

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

---

## 5. How and When to Update This Skill

> **Instruction:** When new tests (e.g. Vitest, Jest) or linters (ESLint, Prettier) are added, update this file with the new checks and commands.
