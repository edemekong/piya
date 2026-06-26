---
description: Inspect Piya shared models, service adapters, dummy data, RTK Query endpoints, and store registration.
---

# Inspect Shared Data Flow

## Preflight

- Confirm whether the change touches models, types, services, dummy data, RTK Query, or page reads.
- Identify server source models in `server/functions/src/shared/model` when model shape matters.

## Plan

Trace the domain from server model to web model/type, service class, RTK Query endpoint, exported hook, and page usage.

## Commands

```bash
rg --files server/functions/src/shared/model web/packages/shared/src/models web/packages/shared/src/types
sed -n '1,260p' web/packages/shared/src/store/domain-api.ts
sed -n '1,240p' web/packages/shared/src/store/store.ts
find web/packages/shared/src/services -maxdepth 1 -type f -print
sed -n '1,240p' web/packages/shared/src/utils/dummy_data.ts
```

## Verification

After edits, run:

```bash
cd web
pnpm -r typecheck
```

## Summary

List the data path touched, hooks exposed, and any dummy data that remains temporary.

## Next Steps

Replace service method bodies first when backend endpoints become available, keeping RTK Query endpoint names stable where possible.
