---
name: piya-reuse-and-naming
description: Use before creating or renaming Piya components, hooks, utilities, helpers, service methods, abstractions, shared exports, or files; guides scoped-vs-global placement, searching for existing code, reuse decisions, and clear domain naming.
---

# Piya Reuse And Naming

Search first, keep code scoped by default, and name behavior directly.

## Search Before Creating

Use behavior and import-path searches before adding new code:

```bash
rg --files web/apps web/packages server/functions/src | sort
rg -n "function .*Name|const .*Name|export .*Name|class .*Name" web/apps web/packages server/functions/src -S
rg -n "format|parse|get|fetch|create|build|to[A-Z]|from[A-Z]" web/apps web/packages server/functions/src -S
```

For UI components, inspect:

- `web/packages/ui/src/components`
- `web/apps/admin/app/components`
- `web/apps/admin/app/pages/<feature>/components`
- `web/apps/portal/app`

For utilities, inspect:

- `web/packages/shared/src/utils`
- `web/apps/admin/app/pages/<feature>`
- `web/apps/admin/app/utils`
- `server/functions/src/shared/utils`
- `server/functions/src/shared/services`

## Scoped Versus Shared

- Keep one-screen UI in the feature component folder.
- Keep feature-only helpers beside the feature.
- Promote UI to `web/packages/ui` only when it is reusable across multiple features or apps and has no feature-specific copy, route assumptions, or workflow state.
- Promote utilities to `web/packages/shared/src/utils` only when multiple features/apps need the same pure behavior.
- Promote backend logic to `server/functions/src/shared/services` or `shared/utils` only when routes/services share it.
- Do not add a global abstraction for one caller.

## Component Rules

- Reuse `@piya/ui` components first.
- Compose an existing component with props/classes before creating a new component.
- Create a feature component when markup is specific to a page workflow.
- Create a shared UI component when the behavior and visual contract are stable across features.
- Avoid putting feature copy, feature-specific data fetching, or sheet/table workflow state in `packages/ui`.

## Utility Rules

- Prefer existing utilities from `@piya/shared/utils` or server `shared/utils`.
- Keep pure formatting/parsing/list/date helpers in utils only when reused.
- Keep domain behavior in services or domain-specific form helpers, not generic utility files.
- Avoid helper files filled with unrelated functions.

## Naming Rules

- Prefer direct domain names:
  - `getUser`, `fetchUser`, `createUser`, `updateUser`
  - `formatCurrency`, `formatDate`, `parsePhoneNumber`
  - `createOrderDraft`, `getOrderFulfillment`, `buildCommunicationStep`
- Avoid vague verbs unless the existing code already uses them for a specific pattern:
  - `normalize`
  - `resolve`
  - `process`
  - `handle`
  - `transform`
  - `mapData`
  - `helper`
- Use `get` for synchronous/local lookup or computed value.
- Use `fetch` for network retrieval only if the codebase already distinguishes it; otherwise follow nearby service naming.
- Use `create`, `build`, or `make` only when constructing a new object; prefer the dominant nearby verb.
- Name boolean helpers as predicates: `isActive`, `hasPendingBatch`, `canSendMessage`, `shouldShowBadge`.
- Do not create wrappers that only rename an existing function.

## Before Editing

State whether the code should be feature-scoped, app-scoped, shared web, shared UI, or backend shared. If unsure, keep it scoped.
