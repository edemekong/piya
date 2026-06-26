---
description: Run Piya web package typechecking after changes to shared, UI, admin, or portal code.
---

# Web Typecheck

Use after changes under `web/apps`, `web/packages/shared`, or `web/packages/ui`.

```bash
cd web
pnpm -r typecheck
```

For shared-only changes:

```bash
cd web
pnpm --filter @piya/shared typecheck
```
