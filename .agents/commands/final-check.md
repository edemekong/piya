---
description: Run or report the correct final verification for Piya changes before responding.
---

# Final Check

## Preflight

- Review changed files with `git status --short`.
- Identify whether changes touch web, server, agent guidance, or multiple areas.

## Plan

Run the smallest sufficient verification for the touched areas and report skipped checks honestly.

## Commands

```bash
git status --short
```

For web changes:

```bash
cd web
pnpm -r typecheck
```

For backend changes:

```bash
cd server/functions
npm run build
```

For `.agents` changes, validate metadata.

## Verification

All required commands should pass before claiming the task is complete.

## Summary

List commands run, pass/fail state, and any skipped checks with reason.

## Next Steps

Fix failures and rerun the relevant check.
