---
name: piya-state-management
description: Use when deciding where Piya web state belongs or when adding/changing React local state, Redux slices, RTK Query hooks, durable UI state, sheet/dialog selected-row state, loading/error data state, or store registration.
---

# Piya State Management

Choose the smallest state owner that preserves the required behavior.

## Placement Rules

- Use RTK Query for server-backed data: contacts, communications, orders, offerings, discounts, gifts, and future backend domain reads.
- Add RTK Query endpoints in `web/packages/shared/src/store/domain-api.ts`.
- Export generated hooks from `web/packages/shared/src/store/index.ts` and package root exports if needed.
- Register API reducers and middleware in `web/packages/shared/src/store/store.ts`.
- Use Redux slices only for durable app UI state shared across screens or required after navigation.
- Keep short-lived state local with React: open sheets, editor mode, active form tab, selected row, selected contact/order/offering, search input, and temporary local create/edit lists before backend mutations exist.
- Keep admin-only workflow state inside `web/apps/admin`; keep portal-only state inside `web/apps/portal`.

## Current Patterns

Use RTK Query for reads:

```ts
const { data: contacts = [] } = useGetContactsQuery();
```

For temporary page-local edits before backend mutations exist:

```ts
const { data: queriedOrders = [] } = useGetOrdersQuery();
const [orders, setOrders] = React.useState<OrderData[]>([]);

React.useEffect(() => {
  setOrders(queriedOrders);
}, [queriedOrders]);
```

When backend writes exist, replace local list mutation with RTK Query mutations and tag invalidation.

## Verification

After store or state changes, run:

```bash
cd web
pnpm -r typecheck
```
