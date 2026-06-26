---
description: Classify the owner and verification path for a Piya change before editing.
---

# Preflight Change

## Preflight

- Read `AGENTS.md`.
- Check current worktree changes and avoid touching unrelated files.

## Plan

Classify the requested change into one or more owners: server route, server service, server model/schema, web shared model/type/service/store, UI package, admin feature, portal feature, or agent guidance.

## Commands

```bash
git status --short
rg --files server/functions/src web/apps web/packages .agents | sort
```

## Verification

Choose checks based on owners:

```bash
cd web
pnpm -r typecheck
```

```bash
cd server/functions
npm run build
```

## Summary

State the owner, nearby examples to inspect, files likely to change, and verification command.

## Next Steps

Inspect examples first, then make the smallest scoped change.
