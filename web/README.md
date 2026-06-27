# Piya Web

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

Create separate Railway services named `admin` and `portal`. The deployment
scripts run from `web`, so Railway uploads `web` as the deployment root.

Admin service:

```sh
railway link
pnpm deploy:admin
```

Set its Railway Config File path to `/railway.admin.toml`:

```sh
Build Command: pnpm build:admin
Start Command: pnpm start:admin
```

Portal service:

Set its Railway Config File path to `/railway.portal.toml`:

```sh
Build Command: pnpm build:portal
Start Command: pnpm start:portal
```

Both Remix apps listen on Railway's `PORT` through `remix-serve`.

If the services are later changed from CLI uploads to GitHub deployments from
the repository root, use `/web` as the Root Directory and change the config
paths to `/web/railway.admin.toml` and `/web/railway.portal.toml`.
