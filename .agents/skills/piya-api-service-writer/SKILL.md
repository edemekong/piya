---
name: piya-api-service-writer
description: Use when adding or changing Piya web shared service classes, backend API requests, BaseAPIService usage, URLController endpoints, request/response types, tokenized calls, service exports, or RTK Query integration backed by services.
---

# Piya API Service Writer

Write service classes as data-access adapters only. App screens should read through RTK Query hooks, not by importing services.

## Source Files

- Base client: `web/packages/shared/src/services/base-api.service.ts`.
- Endpoint builder: `web/packages/shared/src/config/url-controller.ts`.
- Service classes: `web/packages/shared/src/services/*.service.ts`.
- Shared API types: `web/packages/shared/src/types/api.ts`.
- RTK Query bridge: `web/packages/shared/src/store/domain-api.ts`.
- Temporary data: `web/packages/shared/src/utils/dummy_data.ts`.

## Rules

- Extend `BaseAPIService` for backend-backed shared services.
- Add endpoint URL getters or methods to `URLController`; use `encodeURIComponent` for path parameters.
- Type service responses with server-aligned models from `web/packages/shared/src/models`.
- Put request payloads, DTOs, form drafts, and presentation-only shapes in `web/packages/shared/src/types`.
- Keep service exports class-based: export `ExampleService` and `exampleService`. Do not add top-level wrappers like `getExamples()`.
- Return dummy data only from service methods while endpoints are unavailable, and keep all fixtures in `dummy_data.ts`.
- Surface service methods through RTK Query endpoints and generated hooks in `domain-api.ts`.
- Prefer RTK Query mutations with tag invalidation once backend writes exist.

## API Pattern

```ts
export class OrdersService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions = {}) {
    super(options);
  }

  getOrders() {
    return this.get<OrderData[]>(this.urlController.orders, {
      withToken: true,
    });
  }
}

export const ordersService = new OrdersService();
```

If a method still uses fixtures:

```ts
getOrders() {
  return dummyOrders;
}
```

## Verification

After service, API type, URL, or RTK Query changes, run:

```bash
cd web
pnpm -r typecheck
```
