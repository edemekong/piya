# Piya Agent Guide

## First Move

- Inspect the files in the area being changed before proposing or editing.
- Follow nearby naming, exports, route shape, component structure, and state ownership.
- Make the smallest change that satisfies the request. Do not introduce new frameworks, app-wide abstractions, folders, or architectural concepts unless the current code already points there or the user asks for it.
- If a pattern is unclear, search for two or three existing examples and copy the dominant pattern.

## Skill Routing

- Use `piya-architecture-navigator` before broad or cross-cutting changes.
- Use `piya-backend-route-writer` for backend HTTP routes, schemas, responses, and service calls.
- Use `piya-model-sync` when server models, web models, client-only types, or dummy data shapes change.
- Use `piya-auth-security` for auth, OTP, Firebase tokens, protected routes, tenant assumptions, or PII.
- Use `piya-remix-feature-builder` for admin/portal route and page work.
- Use `shared-data-flow`, `piya-api-service-writer`, `piya-state-management`, and `piya-design-system` for their narrower areas.
- Use `piya-verification-gate` before final response for any code change.

## Repository Shape

- `server/functions`: Firebase Functions backend using Express.
- `server/functions/src/api`: versioned HTTP routers. `api-router.ts` mounts `/v1`; `v1.ts` owns public health/auth routes and protected routes after `AuthMiddleware`.
- `server/functions/src/api/<domain>`: route modules for one domain. Keep route handlers thin: validate input, call shared services, return standardized responses.
- `server/functions/src/middlewares`: auth, tenant, error, multipart, and middleware barrel exports.
- `server/functions/src/shared/model`: source-of-truth backend domain models.
- `server/functions/src/shared/schema`: Zod request schemas for backend route validation.
- `server/functions/src/shared/services`: backend data/business services for Firestore, auth, storage, email, and domain work.
- `server/functions/src/shared/types`: backend DTOs and request/response support types.
- `server/functions/src/shared/utils`: backend constants, response helpers, validators, collection names, dates, and notification helpers.
- `server/functions/src/triggers`: Firebase auth and scheduled triggers.
- `web/apps/admin`: Remix admin app. Routes live in `app/routes`; feature screens live in `app/pages`; admin-only layout/input components live in `app/components`.
- `web/apps/portal`: Remix portal app. Keep portal-only routes, providers, and styling here.
- `web/packages/shared`: cross-app models, types, services, RTK Query store, config, and utilities.
- `web/packages/ui`: reusable UI components, theme tokens, Tailwind-facing styles, and UI utilities only.

## Backend Rules

- Add public auth routes under `server/functions/src/api/auth`; add protected user/domain routes under the appropriate `/v1` router after `AuthMiddleware`.
- Use `validateRequest` with schemas from `server/functions/src/shared/schema` for route body, params, or query validation.
- Wrap async handlers with `asyncHandler`.
- Return through `SuccessResult` and `ErrorResult`; add reusable response codes/messages to `API_RESPONSE` in `server/functions/src/shared/utils/constants.ts`.
- Keep Firestore and external service calls in `server/functions/src/shared/services`, not directly inside page-sized route handlers.
- Use `req.currentUser` only after `AuthMiddleware`; public routes must verify their own auth assumptions.
- Keep tenant behavior in `TenantMiddleware` and `req.tenant`; do not duplicate tenant lookup in routes.
- Do not log tokens, OTPs, auth headers, request bodies with PII, or Firebase credentials.

## Source Of Truth

- Server models in `server/functions/src/shared/model` are the source of truth for shared domain models.
- Web shared models live in `web/packages/shared/src/models` and should stay aligned with server shapes.
- Client-only DTOs, form drafts, API payloads, and presentation-only types belong in `web/packages/shared/src/types`.

## Data Flow

- Service classes in `web/packages/shared/src/services` are data-access adapters only.
- Do not export top-level service wrapper functions like `getContacts()` or `getOrders()`.
- App reads should go through RTK Query hooks from `web/packages/shared/src/store/domain-api.ts`.
- Dummy/mock data must stay isolated in `web/packages/shared/src/utils/dummy_data.ts`.
- When backend endpoints are ready, replace service method bodies first; keep RTK Query endpoint names stable where possible.

## Redux Rules

- Use RTK Query for server-backed data: contacts, communications, orders, offerings, discounts, gifts.
- Use Redux slices for durable app UI state shared across screens.
- Use local React state for short-lived component state such as open dialogs, selected rows, and active form tabs unless the state must survive navigation or be shared.
- Register shared reducers and middleware in `web/packages/shared/src/store/store.ts`.

## Package Boundaries

- `packages/shared`: models, types, services, store, cross-app utils.
- `packages/ui`: reusable UI components only.
- `apps/admin`: admin-only pages and workflow state.
- `apps/portal`: portal-only pages and workflow state.
- Do not import from `apps/admin` into `packages/shared` or `packages/ui`.
- Do not put admin-only copy, sheets, table workflows, or route-specific helpers in `packages/ui`.
- Do not put reusable app data access in `apps/admin/app/services`; prefer `web/packages/shared/src/services` plus RTK Query.
- Keep package root exports intentional. Export reusable public API from `src/index.ts`; avoid exposing internal helpers only used by one page.

## Web App Patterns

- Remix route files in `web/apps/admin/app/routes` should stay thin and render page/layout components from `app/pages` or `app/components`.
- Feature pages own their short-lived UI state: open sheet, selected item, active tab, editor mode, search/filter text.
- Feature page components live under `app/pages/<feature>/components`; feature-only types can live beside the page.
- Shared form/list/date/format helpers that cross features belong in `web/packages/shared/src/utils`.
- Use `@piya/shared` for shared hooks, models, types, utilities, and service instances.
- Use `@piya/ui` for reusable buttons, text, sheets, cards, form fields, badges, tabs, and theme tokens.

## Design Rules

- Theme tokens live in `web/packages/ui/src/theme`.
- Tailwind token mappings live in each app `tailwind.config.ts`.
- Prefer `@piya/ui` components before creating new controls.
- Use `lucide-react` icons for app actions when an icon exists.
- Keep admin screens operational and dense. Avoid landing-page or marketing patterns inside app workflows.
- Do not add one-off color systems, typography scales, spacing scales, or nested card shells.

## Verification

Run this after shared/store/model/service changes:

```bash
cd web
pnpm -r typecheck
```

Run this after backend function changes:

```bash
cd server/functions
npm run build
```
