---
description: Inspect an admin or portal feature route, page, components, state, and shared data hooks before feature work.
---

# Inspect Feature

## Preflight

- Determine whether the feature belongs to admin or portal.
- Identify the route file and page folder before editing.

## Plan

Read the route, page, feature components, and shared hooks used by the feature.

## Commands

```bash
rg --files web/apps/admin/app/routes web/apps/admin/app/pages web/apps/portal/app/routes web/apps/portal/app | sort
rg -n "useGet|use[A-Z].*Query|@piya/shared|@piya/ui|React.useState|React.useEffect" web/apps/admin/app/pages web/apps/portal/app -S
```

## Verification

After feature changes:

```bash
cd web
pnpm -r typecheck
```

## Summary

Report the route owner, page owner, local state used, and shared hooks involved.

## Next Steps

Keep page-specific workflow state local unless it must survive navigation or be shared.
