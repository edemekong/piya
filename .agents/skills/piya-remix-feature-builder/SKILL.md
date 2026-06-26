---
name: piya-remix-feature-builder
description: Use when adding or changing Piya Remix admin or portal routes, page components, feature folders, layout wiring, route-level rendering, feature-local components, or admin/portal workflow screens.
---

# Piya Remix Feature Builder

Build app features inside the owning Remix app and keep shared packages reserved for reusable code.

## Folder Rules

- Admin app: `web/apps/admin`.
- Portal app: `web/apps/portal`.
- Remix route files live in `app/routes` and should stay thin.
- Feature screens live in `app/pages/<feature>`.
- Feature-only components live in `app/pages/<feature>/components`.
- Feature-only types can live beside the page, such as `app/pages/<feature>/types.ts`.
- App-only layout/input components live in `app/components`.

## Data And State

- Read shared domain data through RTK Query hooks from `@piya/shared`.
- Use local React state for open sheets, selected rows, editor mode, active tab, search/filter text, and temporary create/edit lists.
- Do not call shared services directly from pages for normal reads.
- Do not add Redux slices for one-screen state.

## UI

- Use `@piya/ui` for reusable controls and layout primitives.
- Use `lucide-react` icons for app actions.
- Match nearby page headers, tables, sheets, spacing, and empty/loading/error behavior.
- Keep admin screens dense and operational.

## Verification

After Remix app changes, run:

```bash
cd web
pnpm -r typecheck
```
