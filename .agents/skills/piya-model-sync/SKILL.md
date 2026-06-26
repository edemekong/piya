---
name: piya-model-sync
description: Use when changing Piya server domain models, web shared models, client-only DTOs/types, dummy data shapes, Firestore converters, or aligning server and web model contracts.
---

# Piya Model Sync

Keep domain shape changes aligned from backend source of truth to web usage.

## Source Of Truth

- Backend shared domain models live in `server/functions/src/shared/model`.
- Web shared models live in `web/packages/shared/src/models` and should mirror backend domain shapes.
- Client-only DTOs, form drafts, API payloads, presentation-only shapes, and app-specific request bodies live in `web/packages/shared/src/types`.
- Backend request schemas live in `server/functions/src/shared/schema`.

## Workflow

1. Inspect the server model first.
2. Update or verify the matching web model.
3. Put non-domain client shapes in `types`, not `models`.
4. Update dummy data in `web/packages/shared/src/utils/dummy_data.ts` if affected.
5. Update service return types, RTK Query endpoint types, form helpers, and table/editor usage as needed.
6. Check Firestore converters if persisted model fields changed.

## Avoid

- Do not create duplicate client model names for server-owned domain data.
- Do not hide model mismatches with `unknown`, broad `Record<string, unknown>`, or local casts.
- Do not move presentation-only form state into shared domain models.

## Verification

For web shape changes:

```bash
cd web
pnpm -r typecheck
```

For backend model/schema changes:

```bash
cd server/functions
npm run build
```
