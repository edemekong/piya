---
name: piya-auth-security
description: Use when reviewing or changing Piya auth, OTP request or verification, Firebase Auth token handling, protected backend endpoints, AuthMiddleware, user services, tenant assumptions, credentials, PII, or security-sensitive logs.
---

# Piya Auth Security

Treat auth, OTP, user identity, tenant, and PII changes as security-sensitive.

## Server Files

- Auth routes: `server/functions/src/api/auth`.
- User routes: `server/functions/src/api/users`.
- Auth middleware: `server/functions/src/middlewares/auth.middleware.ts`.
- Tenant middleware: `server/functions/src/middlewares/tenant.middleware.ts`.
- Auth/user services: `server/functions/src/shared/services/{auth,user}.service.ts`.
- Auth types: `server/functions/src/shared/types/auth.type.ts`.
- Response constants: `server/functions/src/shared/utils/constants.ts`.

## Web Files

- Auth service: `web/packages/shared/src/services/auth.service.ts`.
- User service: `web/packages/shared/src/services/user.service.ts`.
- API base client: `web/packages/shared/src/services/base-api.service.ts`.
- URL controller: `web/packages/shared/src/config/url-controller.ts`.
- Auth types: `web/packages/shared/src/types/auth.ts`.
- Admin auth pages: `web/apps/admin/app/pages/auth`.

## Rules

- Accept protected backend calls only after `AuthMiddleware` or explicit token verification.
- Keep token extraction centralized in `getAuthToken`.
- Web authenticated API calls should use `BaseAPIService` with a token provider where possible.
- Do not log OTPs, auth tokens, authorization headers, Firebase credentials, full user records, or request bodies containing PII.
- Do not expose whether an account exists unless the current route intentionally already does that.
- Keep response codes/messages consistent through `API_RESPONSE`.
- Preserve Firebase Auth as the identity authority.

## Verification

Run backend build after server auth changes:

```bash
cd server/functions
npm run build
```

Run web typecheck after client auth changes:

```bash
cd web
pnpm -r typecheck
```
