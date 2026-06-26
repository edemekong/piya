---
description: Search existing Piya components, hooks, utilities, helpers, services, and exports before creating new reusable code.
---

# Inspect Reuse

## Preflight

- Identify the behavior needed, not just the file name you expect.
- Decide whether the first likely owner is feature-scoped, app-scoped, shared web, shared UI, or backend shared.

## Plan

Search by import path, behavior verbs, domain nouns, and nearby feature examples before adding new code.

## Commands

```bash
rg --files web/packages/ui/src/components web/apps/admin/app/components web/apps/admin/app/pages web/apps/portal/app web/packages/shared/src/utils server/functions/src/shared/utils server/functions/src/shared/services | sort
rg -n "export (function|const|class)|function [A-Z_a-z0-9]+|const [A-Z_a-z0-9]+ =" web/packages/ui/src web/apps web/packages/shared/src server/functions/src/shared -S
rg -n "format|parse|get|fetch|create|build|make|is[A-Z]|has[A-Z]|can[A-Z]|should[A-Z]" web/apps web/packages server/functions/src -S
```

## Verification

If a new shared component or utility is still needed, verify it has at least two callers or a clear shared-layer contract.

## Summary

Report what existing code was found, whether it can be reused, and where any new code should live.

## Next Steps

Prefer scoped code first. Promote only when reuse is real.
