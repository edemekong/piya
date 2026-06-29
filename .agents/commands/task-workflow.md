---
description: Inspect, clarify when needed, execute, verify, and hand off a scoped Piya task.
---

# Task Workflow

## Preflight

- Read `AGENTS.md`.
- Inspect relevant files and current worktree changes without modifying state.
- Identify the requested outcome, boundaries, affected owners, likely files, and verification path.

## Agreement

- Classify the task as a small localized change or a significant change.
- Treat a clear, direct request as authorization for small, localized, reversible edits such as copy, spacing, styling, or isolated UI behavior. Do not add a separate approval round for these changes.
- Ask focused questions when requirements, behavior, ownership, or scope are unclear.
- Suggest options or improvements when they help the user make an informed decision.
- For significant, ambiguous, broad, cross-cutting, security-sensitive, destructive, dependency, model/data, deployment, or Git changes, restate the proposed scope, including explicit exclusions, and obtain user agreement before changing files or state.

## Execution

- Make only the agreed changes.
- Preserve unrelated worktree changes.
- If implementation reveals a required scope change, pause and obtain agreement before continuing.

## Verification

- Review the diff for scope compliance.
- Run the checks required by the touched areas.
- Report failures or skipped checks accurately.

## Summary

- List the exact files and behavior changed.
- List verification commands and their results.
- Identify any agreed work that remains incomplete.

## Git Handoff

After a verified file-changing task, ask the user to choose:

1. Commit the task changes on the current branch.
2. Create a new branch, commit the task changes, push it, and open a draft pull request with `gh`.
3. Leave the changes uncommitted.

Do not perform Git or GitHub write actions until the user explicitly chooses. Stage only changes belonging to the agreed task.
