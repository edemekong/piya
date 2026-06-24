# Yinapp Web

PNPM workspace for the Remix admin and portal apps.

## Structure

```txt
apps/admin      Internal operations/admin app
apps/portal     Business owner/team portal
packages/ui     Shared React UI components
packages/shared Shared config, models, services, types, and utilities
```

## Local Development

```sh
corepack enable
corepack pnpm install
corepack pnpm dev:admin
corepack pnpm dev:portal
```

## Railway

Create separate Railway services for admin and portal from the same repo.

Use `web` as the service root directory.

Admin service:

```sh
Build Command: pnpm build:admin
Start Command: pnpm start:admin
```

Portal service:

```sh
Build Command: pnpm build:portal
Start Command: pnpm start:portal
```

Both Remix apps listen on Railway's `PORT` through `remix-serve`.
