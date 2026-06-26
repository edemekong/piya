---
name: piya-backend-route-writer
description: Use when adding or changing Piya backend Firebase Functions HTTP routes, Express routers, route handlers, Zod request schemas, API response constants, asyncHandler usage, protected route wiring, or backend service calls.
---

# Piya Backend Route Writer

Keep HTTP routes thin and consistent with the existing Express/Firebase Functions backend.

## Files To Inspect

- App setup: `server/functions/src/index.ts`.
- Version router: `server/functions/src/api/v1.ts`.
- Domain routers: `server/functions/src/api/<domain>`.
- Validation schemas: `server/functions/src/shared/schema`.
- Backend services: `server/functions/src/shared/services`.
- Responses: `server/functions/src/shared/utils/api-response.ts` and `server/functions/src/shared/utils/constants.ts`.

## Route Pattern

- Add public auth routes under `server/functions/src/api/auth`.
- Add protected domain routes under the appropriate `/v1` router after `AuthMiddleware`.
- Keep route handlers responsible for validation, auth/tenant checks, service calls, and response shape only.
- Put Firestore, Firebase Auth, storage, email, and external integrations in `shared/services`.
- Use `validateRequest({ body, params, query })` with Zod schemas from `shared/schema`.
- Wrap async route handlers with `asyncHandler`.
- Return with `SuccessResult` and `ErrorResult`.
- Add reusable codes/messages to `API_RESPONSE`; do not inline repeated response literals.

## Safety

- Use `req.currentUser` only on routes protected by `AuthMiddleware`.
- Keep tenant lookup in `TenantMiddleware`; read `req.tenant` instead of duplicating lookup logic.
- Do not log tokens, OTPs, credentials, full request bodies, or PII.

## Verification

After backend changes, run:

```bash
cd server/functions
npm run build
```
