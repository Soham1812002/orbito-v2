---
name: overengineering-review
description: Review code, plans, or diffs specifically for needless complexity, replaceable dependencies, dead flexibility, premature abstractions, and wrappers over stdlib or native platform behavior. Use during planning to challenge speculative architecture or during implementation/review to delete bloat, simplify diffs, and inline unnecessary code.
license: MIT
metadata:
  abvx_status: active
  abvx_origin: adapted
---

# Overengineering Review & Simplification Runbook

Review strictly for unnecessary complexity, dead flexibility, premature abstractions, and replaceable dependencies. This skill does not hunt general correctness bugs unless they directly impact the simplification recommendation.

---

## 1. When to Run This Skill

Apply this review at two critical milestones in the Orbito v2 workflow:

1. **During Step 3 (Planning Gate):** Stress-test proposed architectures, file breakdowns, and module plans against YAGNI before writing any code. Eliminate speculative layers, redundant dependencies, and wrapper files before they are created.
2. **During Step 4 & 5 (Implementation & Diff Review):** Inspect git diffs and newly written files to shrink line counts, collapse single-caller pass-throughs, and replace bespoke helpers with native platform or standard-library primitives.
3. **On Explicit User Request:** Whenever the user asks what can be deleted, simplified, inlined, replaced with native features, or whether a plan/implementation is overengineered.

---

## 2. Review Surface (What to Look For)

Inspect code and architectural plans for:

- **Needless abstractions:** Intermediate helper services or wrapper classes that merely pass calls to Sequelize models or Axios without adding validation, domain logic, or transformation.
- **Replaceable dependencies:** Introducing or keeping npm packages for tasks that modern JavaScript/TypeScript, standard web APIs, or existing repo dependencies already handle cleanly (e.g. date helpers, query string parsers, object deep cloner).
- **Dead flexibility:** Unused configuration flags, excessive generic type parameters with only one concrete implementation, optional callback hooks with zero callers, or speculative polymorphic interfaces.
- **Wrappers around stdlib or native platform features:** Custom functions wrapping `structuredClone`, `URLSearchParams`, `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Array.prototype.find`, or native HTML5 form attributes.
- **Local pass-through helpers:** Functions or files that do nothing except forward arguments to another function with identical signatures.
- **Redundant state management:** Duplicating server state in local `useState` or Redux slices when TanStack React Query already caches and synchronizes it; or calculating derived values in `useEffect` instead of computing them inline during render.
- **Speculative extension points:** Factory patterns, plugin registries, or dynamic dispatchers built for hypothetical future requirements with only one active caller.

---

## 3. Findings Taxonomy

Use these precise tags when recording findings:

| Tag | Meaning |
|---|---|
| `delete:` | Code, file, or layer can disappear entirely with zero replacement needed. |
| `stdlib:` | Custom logic should be replaced by a standard-library primitive (ES2022+ JS/TS, Node.js stdlib). |
| `native:` | Use built-in browser/platform behavior (CSS layout, native HTML attributes, Web APIs) instead of custom app code. |
| `existing-dep:` | Repo already ships an approved dependency (e.g. Zod, TanStack Query, Sequelize, Lucide `AppIcon`, Winston) that makes extra code or new libraries unnecessary. |
| `yagni:` | Speculative abstraction, configurability, or future-proofing with no present payoff ("You Aren't Gonna Need It"). |
| `shrink:` | Same behavior achieved with significantly fewer moving parts, functions, or lines of code. |

---

## 4. Dual-Phase Workflow

### Phase A: Planning Gate (Pre-Code Simplification)
Before writing code in Step 3 (Plan):
1. **Challenge file & layer counts:** Does this feature truly need new helper files or extra services? Stick to the core 5-layer backend and 8-file frontend patterns without adding speculative sub-abstractions.
2. **Audit dependencies:** Check `package.json` before proposing any new library. If existing libraries (Sequelize, TanStack Query, Zod, Lucide) or native language features can solve the problem, reject the new dependency.
3. **Prune speculative requirements:** Verify that every planned configuration flag, parameter, or component variant is actively required by current user stories.

### Phase B: Diff & Implementation Review (Post-Code Simplification)
When reviewing written code or diffs:
1. **Determine scope:** Diff review (`git diff`), specific file review, or module audit.
2. **Ignore style nitpicks:** Do not debate formatting or variable names unless it directly collapses real complexity.
3. **Rank findings by payoff:**
   - 1. Dependency removal (highest payoff)
   - 2. File/layer deletion
   - 3. Abstraction collapse / inlining
   - 4. Line-count shrink
4. **Draft review-grade findings:** Concrete, actionable, minimal prose. No vague "this feels complex" commentary.

---

## 5. Output Format

### Compact Ranked Output (Default)
Output one finding per line in ranked order of payoff:

`<file>:L<line> <tag> <what to cut>. <replacement>. <why it still covers the need>.`

End with one compact summary line:

`net: -<N> lines, -<M> files, -<K> deps possible.`

If the code or plan is already lean and minimal:

`Lean already. Ship.`

### Detailed Prose Format (When Requested)
When the user requests an in-depth simplification report, format as:

1. **Findings Ordered by Impact:** Grouped by Dependency Removal, File Deletion, Abstraction Collapse, and Line-Count Shrink.
2. **Top Simplification Opportunities:** The highest-value changes that preserve 100% of required functionality.
3. **Residual Caveats:** Edge cases where the simpler approach is bound to current scope and what would trigger reconsidering.

---

## 6. Strict Non-Negotiable Boundaries (Never Cut These)

Under no circumstances should the overengineering review recommend removing:

1. **Trust-boundary validation:** Never remove backend `validateDto`, frontend Zod schemas, or input sanitization.
2. **Security & permissions:** Never remove JWT authentication (`authenticate`), RBAC checks (`checkPermissions([PERMISSIONS.XYZ])`), bcrypt password hashing (10 rounds, history, expiry), or rate limiters.
3. **Database transaction integrity:** Multi-table database writes must remain wrapped in `sequelize.transaction()`.
4. **Core architecture patterns:** The backend 5-layer pattern (Router -> Middleware -> Controller -> Service -> Model) and frontend 8-file pattern are foundational consistency rules for Orbito v2. Eliminate bloat *inside* these boundaries, but do not bypass the layers themselves.
5. **Data loss prevention:** Never remove soft-delete handling (`deleted_at`), optimistic locking, or audit logging.
6. **Accessibility & testing basics:** Standard keyboard navigation, focus states, aria labels, and focused regression tests are discipline, not bloat.
7. **Uncommitted user work:** Never delete or overwrite files without explicit confirmation.
