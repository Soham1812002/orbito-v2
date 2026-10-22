---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

# Grill-Me — Interactive Planning & Design Interview Guide

This skill guides agents through relentlessly interviewing the user about every aspect of a plan, architecture, or design before implementation begins, walking down each branch of the decision tree until a complete, shared understanding is reached.

---

## 1. When to Run This Skill

Activate the Grill-Me process:
1. **Before or during Step 2 of the workflow:** For any new feature, database schema change, non-trivial refactor, or UI/UX overhaul.
2. **Whenever requirements are underspecified or have multiple valid approaches:** Resolving tradeoffs upfront eliminates costly rework.
3. **On explicit user request:** Whenever the user types `/grill-me`, asks to "grill me", "stress-test my plan", or "interview me on this design".

---

## 2. Core Rules for Questioning

### 2.1 Always Use the Interactive Question Tool
- **Never pose questions as plain markdown text in your chat response.**
- **Always invoke the `ask_question` tool** (which renders an interactive modal popup with selectable radio/checkbox options and a built-in write-in field).
- Plain-text questions are easily overlooked and interrupt interactive flow.

### 2.2 Ask ONE Question at a Time
- Never bundle multiple questions together into one turn or tool call.
- Wait for the user's answer before posing the next question.
- Asking one question at a time keeps the user focused, prevents cognitive overload, and respects the branching nature of decisions (the answer to Question 1 dictates what Question 2 should be).

### 2.3 Provide 2 to 4 Concrete, Realistic Options
- Each option must represent a realistic architectural or design direction tailored to Orbito v2.
- Avoid generic options like `"Yes"` / `"No"` unless the question is genuinely binary.
- Format options as the user's direct response (e.g. `"Soft delete using deleted_at (paranoid: true)"` rather than `"I will use soft delete"`).
- Put the recommended path first and prefix it with `(Recommended)` (e.g. `"(Recommended) Server-side pagination with AG Grid and React Query"`).
- **Do NOT manually include an "Other" option:** The interactive modal UI automatically provides an editable write-in field.
- **Do NOT manually number or letter the options** (e.g. do not write `"1. Option A"`): The UI numbers them automatically.

### 2.4 Explore the Codebase Before Asking
- If a question can be answered by inspecting existing code, schemas, routes, or documentation, **inspect the codebase yourself first**.
- Never ask the user questions about existing table schemas, existing route names, installed package versions, or established design tokens that can be determined from the repo.

---

## 3. The Interview Flow

```text
[ User Request / Feature Idea ]
             │
             ▼
1. Explore Codebase & Identify Branches (Schema, API, State, UI, Edge Cases)
             │
             ▼
2. Trigger `ask_question` with 2–4 Concrete Options (One question only)
             │
             ▼
3. Receive User Answer
             │
             ▼
4. Acknowledge Decision concisely (1–2 sentences max)
             │
             ▼
   Are there unresolved branches in the decision tree?
   ├─► YES: Go back to Step 2 with the next branch
   └─► NO:
             │
             ▼
5. Provide Structured Summary of All Decisions Made
             │
             ▼
6. Transition Directly to Implementation Plan (Step 3 in AGENTS.md)
```

### Flow Execution Guidelines:
1. **Acknowledge and Advance:** Upon receiving each answer, briefly acknowledge the user's selection in 1–2 sentences, then immediately call `ask_question` for the next logical decision point.
2. **Follow Dependent Branches:** If Option B introduces new sub-decisions (e.g., selecting `"WebSockets"` introduces connection heartbeat and fallback polling questions), resolve the entire sub-branch before moving to adjacent topics.
3. **Exit Condition:** When all critical branches (data model, business logic, authorization, frontend state, and failure modes) have concrete answers, conclude the interview.
4. **Final Summary:** Output a concise markdown table or bulleted list of all agreed decisions, then present the step-by-step implementation plan.

---

## 4. Decision Tree Categories for Orbito v2

When grilling a plan for Orbito v2, systematically explore each relevant category:

### 4.1 Data Model & Migrations (Sequelize & PostgreSQL)
- **Primary Keys:** UUIDv4 vs numeric (Orbito standard: UUIDv4).
- **Soft Delete:** Enforce `paranoid: true` (`deleted_at`) vs hard delete.
- **Relationships:** `hasMany` / `belongsTo` cascade rules and foreign key indexes.
- **Audit Logging:** Is change tracking or audit logging required for this entity?

### 4.2 Security & Permissions (RBAC)
- **Permissions:** Which RBAC permissions are needed? (e.g. `VIEW:ENTITY`, `CREATE:ENTITY`, `OPERATE:ALL`).
- **Data Access Scope:** Can users see all tenant records, or only assigned/owned records?
- **Sensitive Fields:** Are there password, credential, or PII fields that must be excluded from JSON responses?

### 4.3 Backend Architecture & Transactions
- **5-Layer Conformity:** Routes -> Middlewares -> Controller -> Service -> Model.
- **Atomic Writes:** Does the operation span multiple tables requiring `sequelize.transaction()`?
- **DTO Validation:** What are the mandatory `class-validator` constraints?

### 4.4 Frontend State & Architecture
- **State Boundary:** Does this belong in Redux (session/auth only), React Query (server data), or React Context (UI toggles)?
- **Module Structure:** Does it follow the standard 8-file pattern in `frontend/src/pages/<entity>/`?
- **Table / Grid:** AG Grid column configurations, sorting, filtering, and export capabilities.
- **Form Handling:** `react-hook-form` + Zod schema validation in `Entity.schema.ts`.

### 4.5 User Experience & Layout
- **Design Tokens:** Conforms to `index.css` and `.agents/skills/ui-layout-executor/SKILL.md`?
- **Component Primitives:** Use of `AppIcon`, `PageHeader`, `.panel-card`, and responsive breakpoints.
- **State Handling:** Dedicated screens/states for Loading, Empty, Error, and Success.

### 4.6 Edge Cases & Failure Recovery
- **Conflict Handling:** What happens on duplicate names, concurrency conflicts, or rate limits?
- **Fallback Behavior:** What is shown if the API returns 500 or network is down?

---

## 5. Tool Usage Reference

Always call the `ask_question` tool with this structure:

```json
{
  "toolSummary": "Ask database strategy",
  "toolAction": "Asking database strategy",
  "questions": [
    {
      "question": "How should deleted records for this entity be handled in PostgreSQL?",
      "options": [
        "(Recommended) Soft delete with paranoid: true (deleted_at timestamp)",
        "Hard delete with CASCADE on dependent child records",
        "Archive table pattern (move row to an archive table on deletion)"
      ],
      "is_multi_select": false
    }
  ]
}
```

---

## 6. How and When to Update This Skill

> **Instruction:** When new architectural layers, integrations, or recurring decision patterns are established in Orbito v2, update the decision tree categories in Section 4 to ensure future planning interviews cover them.
