#!/bin/bash
# Antigravity PreInvocation hook
# Enforces UI UX Pro Max pre-flight analysis, ui-layout-executor compliance,
# and post-implementation skill updates to avoid recurring mistakes.

cat << 'EOF'
{
  "injectSteps": [
    {
      "ephemeralMessage": "🚨 [UI & Implementation Standards Active]\n1. UI Planning & Design Analysis: If design URLs (Figma) are provided, inspect them via Figma MCP tools (get_figma_data). Run the globally installed ui-ux-pro-max skill to extract design system tokens, typography, UX patterns, and stack guidelines.\n2. UI Implementation Standards: Always adhere to .agents/skills/ui-layout-executor/SKILL.md (use index.css tokens, common classes like .panel-card, .focus-ring, .touch-target, .nav-item-*, .badge-*, AppIcon, PageHeader, and full mobile/tablet responsiveness).\n3. Curated Skill Updates: Do NOT add one-off bug fixes, task logs, or trivial tweaks to skills. Skills are NOT changelogs. ONLY record durable architectural conventions, reusable standards, and guidelines that must be followed whenever doing such or related tasks in the future."
    }
  ]
}
EOF
