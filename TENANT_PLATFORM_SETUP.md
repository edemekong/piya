# Piya Tenant Platform Setup

Last reviewed: 27 June 2026

## 1. Decision

Piya will not accept customer-owned portal or email domains in the first
release.

The initial platform identities are:

| Purpose | Address |
| --- | --- |
| Dashboard | `https://dashboard.piya.store` |
| Public tenant portal | `https://<business-slug>.piya.store` |
| Outbound tenant email | `<business-slug>@mail.piya.store` |
| Email reply routing | The tenant's selected Reply-to email address |
| WhatsApp | The tenant's connected WhatsApp Business number |
| SMS, later | A tenant or shared sender supported by the SMS provider |

The infrastructure boundary is:

```text
dashboard.piya.store ───────────────> Spaceship DNS ──> Railway admin service

<business-slug>.piya.store ─────────> Spaceship DNS ──> Railway portal service

mail.piya.store ────────────────────> Resend ──────> Piya webhooks
```

Spaceship is the authoritative DNS provider. Railway provides edge routing,
public TLS and runs the two Remix applications. Resend handles email. Meta
WhatsApp Cloud API handles WhatsApp.

Cloudflare for SaaS is not required while every portal is under `piya.store`.
It becomes relevant only if Piya later supports customer-owned domains such as
`shop.customer.com`.

## 2. Scope of this setup

Complete the work in this order:

1. Deploy and verify the admin and portal Railway services.
2. Connect `dashboard.piya.store`.
3. Connect the `*.piya.store` wildcard to the portal service.
4. Verify that exact infrastructure subdomains do not fall through to the
   wildcard portal.
5. Implement business slug allocation and tenant lookup.
6. Implement email through Resend.
7. Implement WhatsApp through Meta.
8. Implement SMS later.

Do not configure email or WhatsApp DNS records until the Railway and Spaceship
portal setup passes the acceptance checklist in this document.

## 3. Prerequisites

Before changing Railway or Spaceship:

- `piya.store` must use Spaceship nameservers.
- Its DNS records must be active under **Spaceship → Advanced DNS** rather than
  shown only under inactive records.
- The production Git branch must be connected to the Railway `piya` project.
- The Railway production environment must contain two independent services:
  `admin` and `portal`.
- The required production web environment variables must be available:

```text
VITE_API_BASE_URL
VITE_GOOGLE_MAPS_API_KEY
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_USE_FIREBASE_EMULATORS=false
```

Do not put server credentials, Firebase Admin credentials, Resend keys or Meta
tokens into `VITE_*` variables. `VITE_*` values are included in browser builds.

## 4. Railway setup

The current services use local Railway CLI uploads. Run deployment commands
from `web`; Railway treats that directory as the uploaded project root.

### 4.1 Important existing configuration

The repository files and their service-level Railway paths are:

```text
web/railway.admin.toml  → /railway.admin.toml  → admin service
web/railway.portal.toml → /railway.portal.toml → portal service
```

Assign each config file only to its matching service. Railway config-as-code
overrides build and deployment values entered in the Railway dashboard.

If the services are later connected directly to GitHub instead of deployed by
the local CLI, set Root Directory to `/web` and use the repository paths
`/web/railway.admin.toml` and `/web/railway.portal.toml`.

### 4.2 Configure the admin service

In Railway:

1. Open the `piya` project and the production environment.
2. Create or select the `admin` service.
3. Leave **Root Directory** empty for the current CLI-upload workflow.
4. Set **Railway Config File** to `/railway.admin.toml`.
5. Run deployments from the repository's `web` directory.
6. Confirm the resolved deployment settings show:

```text
Build Command: pnpm build:admin
Start Command: pnpm start:admin
```

7. Add the required `VITE_*` production variables.
8. Generate a temporary Railway domain.
9. Deploy and open the temporary domain.
10. Confirm the admin application loads without missing-configuration errors.

### 4.3 Configure the portal service

In Railway:

1. Create or select a separate service named `portal`.
2. Leave **Root Directory** empty for the current CLI-upload workflow.
3. Set **Railway Config File** to `/railway.portal.toml`.
4. Run deployments from the repository's `web` directory.
5. Confirm the resolved deployment settings show:

```text
Build Command: pnpm build:portal
Start Command: pnpm start:portal
```

6. Add the required `VITE_*` production variables.
7. Generate a temporary Railway domain.
8. Deploy and open the temporary domain.
9. Confirm the portal application loads.
10. Inspect the deployment details and verify that the resolved build and start
    commands are the portal commands.

Optional watch paths for the portal service are:

```text
/web/apps/portal/**
/web/packages/shared/**
/web/packages/ui/**
/web/package.json
/web/pnpm-lock.yaml
```

Do not add restrictive watch paths until normal deployments are working.

### 4.4 Railway runtime expectations

- Do not set a fixed public port. Railway supplies `PORT`, and `remix-serve`
  already listens on it.
- Leave domain target-port detection automatic unless Railway fails to detect
  the running port.
- Keep the temporary `*.up.railway.app` domains. They are useful for isolating
  Railway deployment failures from Spaceship/DNS failures.
- Configure a health check against `/` only while `/` reliably returns `200`.
  Add a dedicated health endpoint later if the portal root becomes
  tenant-dependent.

## 5. Connect the admin domain

### 5.1 Ask Railway for the records

On the Railway `admin` service:

1. Open **Settings → Networking → Public Networking**.
2. Select **Custom Domain**.
3. Enter `dashboard.piya.store`.
4. Copy the exact CNAME and TXT verification records Railway displays.

Railway requires both records. A resolving CNAME without the TXT ownership
record can still return `404`.

### 5.2 Add the records in Spaceship

In **Spaceship → Advanced DNS → piya.store**:

1. Add the Railway-provided TXT verification record exactly as displayed.
2. Add the CNAME:

```text
Type: CNAME
Host: dashboard
Value: <the exact Railway target>
TTL: Default
```

3. Wait for Railway to show the domain and certificate as active.
4. Open `https://dashboard.piya.store`.

Do not manually invent the Railway target or verification value.

## 6. Connect wildcard tenant portals

### 6.1 Ask Railway for wildcard records

On the Railway `portal` service:

1. Open **Settings → Networking → Public Networking**.
2. Select **Custom Domain**.
3. Enter `*.piya.store`.
4. Copy every record Railway returns.

For a wildcard, Railway currently returns:

- One wildcard CNAME for portal traffic.
- One certificate-validation CNAME, normally under `_acme-challenge`.
- One TXT ownership-verification record.

Use the exact names and values returned by Railway. Do not copy example values
from this document.

### 6.2 Add wildcard records in Spaceship

In **Spaceship → Advanced DNS → piya.store**, create every record Railway
returns.

| Railway record | Spaceship host |
| --- | --- |
| Wildcard traffic CNAME | `*` |
| Certificate-validation CNAME | Use Railway's exact host, normally `_acme-challenge` |
| TXT ownership record | Use Railway's exact host |

The resulting traffic record will resemble:

```text
Type: CNAME
Host: *
Value: <the exact Railway portal target>
TTL: Default
```

Do not add `piya.store` to record hosts unless Spaceship explicitly asks for a
fully qualified hostname. Spaceship normally appends the zone automatically,
so host `*` becomes `*.piya.store`.

### 6.3 Wait for Railway TLS

Railway automatically requests and renews a Let's Encrypt wildcard certificate.

1. Wait until Railway marks the wildcard domain as active.
2. Wait until Railway marks its certificate as active.
3. Do not remove or alter the `_acme-challenge` record after activation;
   Railway needs it for certificate renewal.
4. Test HTTPS directly. There is no Cloudflare encryption mode to configure.

### 6.4 Protect infrastructure names from the wildcard

An exact DNS record takes precedence over `*.piya.store`. Create explicit
records before using these names:

```text
dashboard
api
mail
reply
www
support
status
admin
auth
assets
cdn
```

Also reserve those values in Piya's business-slug validation. A business must
never be able to claim an infrastructure name.

Decide separately what the apex domain does:

```text
piya.store
www.piya.store
```

Recommended behavior:

- `piya.store` serves Piya's main website.
- `www.piya.store` redirects to `piya.store`.
- Neither address resolves a tenant.

## 7. Spaceship DNS rules for the initial release

Use conservative settings:

- Keep the Railway CNAME and TXT values exactly as Railway provides them.
- Do not create separate DNS records for each business slug.
- Do not enable Spaceship web forwarding for the wildcard.
- Do not connect `*.piya.store` to Spaceship hosting.
- Preserve unrelated MX, SPF, DKIM and DMARC records.
- Railway and the Remix applications will control response caching.

## 8. Infrastructure validation

Run these checks after Railway reports the domains as active.

### 8.1 DNS checks

```sh
dig dashboard.piya.store
dig test-tenant.piya.store
dig CNAME _acme-challenge.piya.store
```

The wildcard query should resolve through the Railway-provided CNAME. The
certificate-validation CNAME should remain publicly visible.

### 8.2 HTTP checks

```sh
curl -I https://dashboard.piya.store
curl -I https://test-tenant.piya.store
```

Expected infrastructure result:

- Both complete TLS successfully.
- `dashboard.piya.store` loads the admin deployment.
- `test-tenant.piya.store` reaches the portal deployment.
- The portal must not render another business for an unknown slug once tenant
  resolution is implemented.

### 8.3 Railway isolation checks

Open the temporary Railway domains:

- If the temporary portal domain fails, fix Railway before Spaceship DNS.
- If the temporary domain works but the Piya domain fails, inspect the
  Spaceship CNAME/TXT records, `_acme-challenge` and Railway domain status.
- A browser TLS error normally means the Railway certificate is not ready or
  its validation CNAME is incorrect.
- A Railway `404` with resolving DNS commonly means the TXT ownership record is
  missing or not verified.

## 9. Acceptance checklist

The infrastructure setup is complete only when:

- [ ] Railway has separate `admin` and `portal` services.
- [ ] The admin deployment uses `pnpm build:admin` and `pnpm start:admin`.
- [ ] The portal deployment uses `pnpm build:portal` and
      `pnpm start:portal`.
- [ ] Both temporary Railway domains work.
- [ ] `dashboard.piya.store` loads the admin service over HTTPS.
- [ ] `any-test-name.piya.store` loads the portal service over HTTPS.
- [ ] Spaceship is authoritative for `piya.store`.
- [ ] The wildcard `_acme-challenge` record matches Railway exactly.
- [ ] Railway marks its wildcard certificate as active.
- [ ] Reserved infrastructure names are documented.
- [ ] An unknown tenant hostname never displays a different tenant's data.

## 10. What to implement after infrastructure setup

Infrastructure only routes hostnames to the portal. It does not yet identify a
business safely.

### 10.1 Business slug contract

Implement a dedicated business slug with these rules:

- Suggest it during account setup from the business name.
- Let the user review or edit the suggestion before connecting the domain.
- Convert to lowercase ASCII labels separated by hyphens.
- Check existing business slugs when the user submits the value.
- Return a clear collision error when the selected slug is occupied; do not
  silently add a suffix.
- Reject reserved infrastructure names.
- Do not silently change the slug when the business name changes.
- Allow a controlled rename later.
- Retain the business ID as the durable identity; the slug is a public locator.

The account-setup integration UI should let the user connect:

```text
https://<business-slug>.piya.store
https://piya.store/<business-slug>
```

### 10.2 Tenant lookup

Implement an indexed lookup:

```text
normalized hostname/slug → businessId → active business branding
```

Requirements:

- Resolve only active businesses.
- Return a tenant-not-found page for unknown, disabled or reserved hosts.
- Never fall back to an arbitrary/default business.
- Keep the hostname lookup efficient; do not scan all businesses.
- Cache only after invalidation behavior for slug changes is defined.

`BusinessService.getBrandConfig()` is the backend hostname lookup boundary.

### 10.3 Portal hostname handling

The portal should:

1. Read the request hostname on the server.
2. Normalize lowercase, remove the port and reject malformed hostnames.
3. Extract exactly one label before `.piya.store`.
4. Reject apex, nested, reserved and unknown hostnames.
5. Load tenant branding/data using the resolved business ID.
6. Render a safe tenant-not-found response when resolution fails.

### 10.4 API tenant security

The public portal calls the Firebase Functions API, so the API request's normal
`Host` header will identify the API host, not the tenant portal.

The tenant context therefore needs an explicit contract such as a normalized
portal hostname or slug. That value is a locator, not proof of authorization.

The backend must:

- Normalize and validate the supplied tenant locator.
- Resolve it to a business server-side.
- Require Firebase authentication and business membership for protected tenant
  operations.
- Never authorize access from a client-provided slug/header alone.
- Never accept a spoofed forwarded-host header as proof of tenant membership.
- Avoid logging auth tokens, full request bodies or customer PII.

The current tenant middleware prefers `x-forwarded-host` before
`x-tenant-host`. That behavior must be reviewed before the portal API
integration because the forwarded host may be the Firebase API hostname.

### 10.5 CORS

The current backend CORS list contains exact origins such as
`https://dashboard.piya.store` and `https://piya.store`. It does not allow
tenant subdomains.

Add a narrowly validated production rule for:

```text
https://<one-valid-dns-label>.piya.store
```

Do not use a broad substring or `endsWith("piya.store")` check. Validate the
URL protocol, hostname boundary and exact single-label shape.

### 10.6 Tests required

Add tests for:

- Slug normalization.
- Reserved words.
- Duplicate slugs.
- Unknown and inactive tenants.
- Uppercase hostnames and hostnames containing ports.
- Apex and nested subdomains.
- Cross-tenant protected access.
- Spoofed tenant headers.
- Allowed and rejected CORS origins.
- Tenant branding returned for the correct hostname.

## 11. Email phase: Resend

Start this only after tenant slug resolution is stable.

### 11.1 Domain plan

Use:

```text
Visible From: <business-slug>@mail.piya.store
Reply-To: <the tenant's selected email address>
```

Do not create `<business-slug>.piya.store` as an email domain for every tenant.

### 11.2 Resend setup

1. Add `mail.piya.store` as a Resend sending domain.
2. Add the exact SPF, DKIM and return-path records Resend provides to
   Spaceship Advanced DNS.
3. Add a DMARC policy and begin in monitoring mode.
4. Verify the sending domain in Resend.
5. Enable receiving for `mail.piya.store`.
6. Add the exact Resend receiving MX record to Spaceship Advanced DNS.
7. Configure a production `email.received` webhook.
8. Verify the Resend webhook signature.
9. Resolve the recipient local part to the business slug, then use
   `In-Reply-To` and `References` headers to match an existing chat. Create a
   new inbound chat when those headers do not identify one.
10. Subscribe to delivery, bounce, complaint and unsubscribe events.
11. Apply per-tenant sending limits and abuse controls because all tenants
    share Piya's sending reputation.

Reject inbound messages for unknown or suspended business slugs.

## 12. WhatsApp phase: Meta Cloud API

WhatsApp does not have an email-style alias equivalent. Prefer a tenant-owned
WhatsApp Business number.

1. Complete Piya's Meta business and app setup.
2. Configure Meta WhatsApp Cloud API and production webhooks.
3. Use Embedded Signup so a tenant can connect its WhatsApp Business Account
   and phone number.
4. Store the tenant's WhatsApp Business Account ID and phone number ID.
5. Map webhook `phone_number_id` values to the owning business.
6. Verify webhook signatures.
7. Store provider message IDs and delivery/read status updates.
8. Enforce template, consent and customer-service-window rules.
9. Never log Meta access tokens or full message payloads containing PII.

A single shared Piya WhatsApp number should not be the default. New inbound
messages to a shared number do not reliably identify which tenant the customer
intended to contact.

## 13. SMS phase

Implement SMS after WhatsApp:

- Confirm supported countries and sender-registration rules with LINK Mobility.
- Decide per country whether the sender is shared, alphanumeric, a phone number
  or a short code.
- Route inbound replies using the receiving number and stored conversation.
- Enforce consent, opt-out keywords and quiet hours.
- Store delivery receipts and provider message IDs.

## 14. Rollback

If the wildcard deployment causes an incident:

1. Remove or temporarily replace the Spaceship `*` traffic record while
   investigating.
2. Keep `dashboard.piya.store` as an exact record so the dashboard remains
   available.
3. Use the Railway temporary portal domain to test the deployment directly.
4. Roll Railway back to the last healthy portal deployment when the failure is
   application-related.
5. Do not delete verification records during a short incident; unnecessary
   deletion can trigger certificate revalidation.

## 15. Official references

- [Railway: working with domains](https://docs.railway.com/networking/domains/working-with-domains)
- [Railway: deploy a monorepo](https://docs.railway.com/guides/deploying-a-monorepo)
- [Railway: build configuration](https://docs.railway.com/builds/build-configuration)
- [Railway: config as code](https://docs.railway.com/config-as-code)
- [Railway: SSL troubleshooting](https://docs.railway.com/networking/troubleshooting/ssl)
- [Spaceship: DNS knowledge base](https://www.spaceship.com/en-GB/knowledgebase/category/knowledgebase-dns/)
- [Resend: managing domains](https://resend.com/docs/dashboard/domains/introduction)
- [Resend: receiving email](https://resend.com/docs/dashboard/receiving/introduction)
- [Resend: custom receiving domains](https://resend.com/docs/dashboard/receiving/custom-domains)
- [Meta: WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api)
