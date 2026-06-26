---
name: piya-architecture-navigator
description: Use when orienting in the Piya repo, choosing where code belongs, inspecting folder structure, avoiding over-engineering, planning cross-server/web changes, or deciding backend route, service, model, web app, shared package, and UI package boundaries.
---

# Piya Architecture Navigator

Use this before broad or cross-cutting changes. Let the existing folders decide the shape of the work.

## Orientation

- Start with `AGENTS.md`.
- Inspect the target feature and two nearby examples before editing.
- Prefer `rg --files` and `rg -n` to find existing patterns.
- Keep changes inside the narrowest owner: backend route, backend shared service, shared web package, admin app feature, portal app feature, or UI package.

## Server Structure

- `server/functions/src/index.ts`: Express app setup for Firebase Functions, CORS, rate limit, tenant middleware, API router, 404, and error middleware.
- `server/functions/src/api/api-router.ts`: mounts `/v1`.
- `server/functions/src/api/v1.ts`: health route, public auth router, then `AuthMiddleware`, then protected routers.
- `server/functions/src/api/<domain>`: domain route modules and route barrel.
- `server/functions/src/middlewares`: auth, tenant, multipart, and error middleware.
- `server/functions/src/shared/model`: backend domain model source of truth.
- `server/functions/src/shared/schema`: Zod validation schemas.
- `server/functions/src/shared/services`: Firestore, Firebase Auth, storage, email, business, user, and other backend services.
- `server/functions/src/shared/utils`: response helpers, constants, validators, collections, dates, and notification helpers.
- `server/functions/src/triggers`: Firebase auth and scheduled triggers.

## Server Patterns

- Keep route handlers thin: parse/validate, check auth/tenant assumptions, call service, return result.
- Validate with `validateRequest({ body, params, query })` and Zod schemas from `shared/schema`.
- Wrap async route handlers with `asyncHandler`.
- Return through `SuccessResult` and `ErrorResult`.
- Add reusable API response messages/codes to `API_RESPONSE`.
- Put Firestore/external integrations in `shared/services`, not directly in route handlers.
- Use `req.currentUser` only on routes protected by `AuthMiddleware`.

## Web Structure

- `web/apps/admin`: Remix admin app with route files, page features, providers, app-only layout/input components, styles, and assets.
- `web/apps/portal`: Remix portal app with its own routes, providers, styles, and assets.
- `web/packages/shared`: shared config, models, client-only types, service adapters, store, RTK Query, and cross-app utilities.
- `web/packages/ui`: reusable visual components, theme tokens, styles, `cn`, and UI exports.

## Web Patterns

- Route files render page/layout components; keep logic in `app/pages` and reusable UI in `packages/ui`.
- Keep feature components under `web/apps/admin/app/pages/<feature>/components`.
- Use local React state for sheets, selected rows, editor modes, filters, and temporary create/edit lists.
- Use RTK Query hooks from `@piya/shared` for shared domain reads.
- Keep service classes as adapters in `web/packages/shared/src/services`; do not call them directly from pages for reads.
- Put temporary fixtures only in `web/packages/shared/src/utils/dummy_data.ts`.
- Use `@piya/ui` and theme tokens before adding new component primitives or styles.

## Anti-Overreach Rules

- Do not create new architecture folders just because a task is new.
- Do not move code across packages unless the same need exists in more than one owner.
- Do not add a global Redux slice for state used by one screen.
- Do not add top-level service wrapper functions.
- Do not invent backend endpoints on the client; add `URLController` paths only when the server route exists or the task is explicitly to wire a planned endpoint.
- Do not create duplicate models in `types` when the shape is shared domain data; align `models` to server instead.
- Do not rewrite working pages to a new pattern while fixing a local issue.

## Verification

For web changes:

```bash
cd web
pnpm -r typecheck
```

For backend changes:

```bash
cd server/functions
npm run build
```
