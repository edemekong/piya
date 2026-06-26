---
description: Inspect Piya auth, OTP, Firebase token, user, and protected-route flow before auth-sensitive changes.
---

# Inspect Auth Flow

## Preflight

- Treat OTPs, tokens, Firebase user data, and PII as sensitive.
- Do not print secrets or full request bodies.

## Plan

Read server auth routes/middleware and matching web auth/user services before editing.

## Commands

```bash
sed -n '1,260p' server/functions/src/api/auth/route.ts
sed -n '1,260p' server/functions/src/api/auth/request-otp.ts
sed -n '1,300p' server/functions/src/api/auth/verify-auth-otp.ts
sed -n '1,320p' server/functions/src/middlewares/auth.middleware.ts
sed -n '1,260p' web/packages/shared/src/services/auth.service.ts
sed -n '1,280p' web/packages/shared/src/services/user.service.ts
```

## Verification

Run the relevant checks after changes:

```bash
cd server/functions
npm run build
```

```bash
cd web
pnpm -r typecheck
```

## Summary

Report the auth boundary touched and any security-sensitive assumptions.

## Next Steps

Prefer centralized token handling and avoid logging sensitive data.
