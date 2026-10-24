#!/bin/bash
# Antigravity PreInvocation hook
# Enforces plan-executor orchestration, backend-pattern-executor,
# ui-layout-executor compliance, and curated skill updates on major changes.

cat << 'EOF'
{
  "injectSteps": [
    {
      "ephemeralMessage": "🚨 [Orbito v2 Architecture & Implementation Standards Active]\n1. Plan Executor Orchestration: Execute all plans via .agents/skills/plan-executor/SKILL.md. Route backend work to backend-pattern-executor and frontend work to ui-layout-executor. Verify after each atomic step (npm run build, migrate:check) and loop continuously until 100% of the plan and goal are achieved.\n2. Backend Standards: Strictly enforce the 5 layers (routes -> middlewares -> controllers -> services -> models), atomic transactions (sequelize.transaction()), Zod DTO validation, and zero-drift migrations (npm run migrate:check).\n3. Frontend & UI Standards: Adhere strictly to .agents/skills/ui-layout-executor/SKILL.md (strict 2-font rule: Inter & font-mono, .panel-card p-4 sm:p-5 overflow-hidden, <TableFilterBar>, <AppDataTable>, <TwoLineCell>, clean PageHeader with no title badges, 8-file module pattern).\n4. Curated Skill Updates on Major Changes: Proactively update the necessary skills in .agents/skills/ and AGENTS.md whenever major changes, architectural shifts, or reusable common patterns are implemented to prevent future inconsistency. Do NOT update everything (never add changelogs, task logs, or trivial bug fixes); ONLY record durable, repeatable standards."
    }
  ]
}
EOF
