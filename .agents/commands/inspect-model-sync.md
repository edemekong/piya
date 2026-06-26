---
description: Inspect server and web model alignment for a Piya domain before changing shared shapes.
---

# Inspect Model Sync

## Preflight

- Identify the domain name, such as user, contact, order, offering, communication, gift, or discount.
- Start from the server model.

## Plan

Compare server model, web model, client-only types, dummy data, services, and RTK Query usage.

## Commands

```bash
rg --files server/functions/src/shared/model web/packages/shared/src/models web/packages/shared/src/types | sort
sed -n '1,260p' web/packages/shared/src/store/domain-api.ts
sed -n '1,260p' web/packages/shared/src/utils/dummy_data.ts
```

## Verification

Run checks for changed areas:

```bash
cd web
pnpm -r typecheck
```

```bash
cd server/functions
npm run build
```

## Summary

Report which server model is source of truth and which web files were aligned.

## Next Steps

Update services, dummy data, and RTK Query endpoint types only where the changed shape is used.
