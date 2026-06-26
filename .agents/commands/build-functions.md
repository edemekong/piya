---
description: Build Piya Firebase Functions after backend server changes.
---

# Build Functions

## Preflight

- Confirm the change touches `server/functions`.
- Inspect the relevant route, service, middleware, schema, or model first.

## Plan

Run the backend TypeScript build from the functions package.

## Commands

```bash
cd server/functions
npm run build
```

## Verification

The command must complete without TypeScript errors.

## Summary

Report whether the backend build passed and include the first actionable error if it failed.

## Next Steps

Fix compile errors in the smallest owning file, then rerun the build.
