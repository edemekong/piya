---
description: Inspect Piya server and web architecture before broad or cross-cutting changes.
---

# Inspect Architecture

## Preflight

- Read `AGENTS.md`.
- Identify whether the request touches server, web shared, UI, admin, portal, or multiple areas.
- Check the worktree and avoid reverting unrelated changes.

## Plan

Trace the existing folder owner and nearby examples before proposing or editing.

## Commands

```bash
find server/functions/src -maxdepth 4 -type d | sort
find web/apps web/packages -maxdepth 4 -type d | sort
rg --files server/functions/src | sort
rg --files web/apps web/packages | sort
```

For server route work:

```bash
sed -n '1,260p' server/functions/src/index.ts
sed -n '1,260p' server/functions/src/api/v1.ts
sed -n '1,260p' server/functions/src/shared/utils/api-response.ts
sed -n '1,260p' server/functions/src/shared/utils/validator.ts
```

For web app work:

```bash
sed -n '1,240p' web/apps/admin/app/root.tsx
sed -n '1,240p' web/apps/admin/app/providers/redux-provider.tsx
sed -n '1,260p' web/packages/shared/src/index.ts
sed -n '1,220p' web/packages/ui/src/index.ts
```

## Verification

Run the verification command for the area changed:

```bash
cd web
pnpm -r typecheck
```

```bash
cd server/functions
npm run build
```

## Summary

Report the chosen owner, examples inspected, and why the change stayed within that boundary.

## Next Steps

Make the smallest scoped edit and avoid unrelated refactors.
