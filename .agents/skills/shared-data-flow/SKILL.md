---
name: shared-data-flow
description: Use when changing Piya web shared models, client-only types, dummy data, service adapters, RTK Query endpoints, shared store registration, or admin/portal reads backed by shared domain data.
---

# Shared Data Flow

Keep Piya shared domain data aligned from server model to web model to service adapter to RTK Query hook.

## Rules

- Treat `server/functions/src/shared/model` as the source of truth for shared domain models.
- Keep aligned web models in `web/packages/shared/src/models`.
- Put client-only DTOs, form drafts, API payloads, and presentation-only types in `web/packages/shared/src/types`.
- Keep service classes as adapters. They may call Axios/Firebase or return dummy data, but pages should not call them directly.
- Put all temporary fixture data in `web/packages/shared/src/utils/dummy_data.ts`.
- Add RTK Query endpoints in `web/packages/shared/src/store/domain-api.ts`.
- Export generated hooks from `web/packages/shared/src/store/index.ts`.
- Register API reducer and middleware in `web/packages/shared/src/store/store.ts`.
- Keep app UI state local or in app-specific slices. Do not put screen-only state into shared RTK Query.
- Do not export top-level wrapper functions like `getContacts()` or `getOrders()` from services.

## Pattern

```ts
const { data = [] } = useGetContactsQuery();
```

For page-local create/edit behavior before backend mutations exist:

```ts
const { data: queriedOrders = [] } = useGetOrdersQuery();
const [orders, setOrders] = React.useState<OrderData[]>([]);

React.useEffect(() => {
  setOrders(queriedOrders);
}, [queriedOrders]);
```

When real mutations are added, prefer RTK Query mutations with tag invalidation over manual list state.

## Verification

After shared model, store, service, or data-flow changes, run:

```bash
cd web
pnpm -r typecheck
```
