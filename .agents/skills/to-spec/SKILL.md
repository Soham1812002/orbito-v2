---
name: to-spec
description: "Turn the current conversation into a spec and publish it to the project issue tracker: no interview, just synthesis of what you've already discussed."
disable-model-invocation: true
---

# To-Spec — Conversation-to-Specification Synthesis

This skill takes the current conversation context and codebase understanding and produces a comprehensive, unambiguous engineering specification. **Do NOT interview the user; just synthesize what has already been discussed and decided.**

The issue tracker and triage label vocabulary should have been provided to you. If not, inform the user to run `/setup-matt-pocock-skills`.

---

## Process

### 1. Explore the Repository & Domain Vocabulary
- Explore the repository to understand the current state of the codebase if you haven't already.
- Use the project's domain glossary vocabulary throughout the spec.
- Respect any Architecture Decision Records (ADRs) or established patterns in the area you are touching.

### 2. Sketch Out Testing Seams
- Sketch out the seams at which the feature will be tested.
- Existing seams should always be preferred over introducing new ones.
- Use the highest seam possible (e.g., API boundaries, router/integration tests, or user-level workflows) to avoid coupling tests to private implementation details.
- The fewer seams across the codebase, the better — default to **one seam per spec** unless a genuine external boundary forces another.
- Verify with the user that these seams match their expectations if there is any ambiguity.

### 3. Write & Publish the Spec
Write the spec following the exact `<spec-template>` below, then publish it to the project issue tracker. Apply the `ready-for-agent` triage label (no additional triage required).

---

## Spec Template

```markdown
## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

Example:
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.
```

---

## 4. Execution Route Selection

Choose the execution route after publishing:

- **Fork (`fork → /spec-executor`):** If the complete spec fits one implementation context and the current conversation is coherent enough to fork.
- **Tickets (`/to-tickets`):** If it needs several tracer-bullet slices, parallel work, cross-agent transfer, or context compression. Do not pretend a large spec is fork-ready.
- **Unresolved (`SPEC NOT READY`):** If a product decision or test seam is still unresolved, emit `SPEC NOT READY` along with the missing decision. Do not launch implementation.

---

## 5. Launch Block

End a ready result with this compact launch block so a forked thread can locate the final contract without guessing between drafts:

```text
SPEC READY

- Status: ready for implementation
- Source: <published spec URL or path>
- Repository: <implementation repository>
- Baseline: <current commit, branch, or explicit source baseline>
- Test seam: <highest agreed behavior seam>
- Non-goals: <explicit exclusions>
- External authority: <commit, push, review, deploy, tracker, data, and real-service permissions; default ungranted>
- Next route: fork + /spec-executor | /to-tickets
```

> **Note:** The launch block is an index into the approved spec, not a replacement for it. Do not repeat the full spec inside the block.
