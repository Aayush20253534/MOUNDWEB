# Part 15 — Production Deployment Kit

## Delivered in the repository

- `render.yaml`: Render Blueprint for the Express API. It builds from the monorepo root, starts the compiled API and checks `/api/health`. The Blueprint explicitly keeps admin and inquiry collection disabled.
- `apps/web/vercel.json`: Vercel Next.js build configuration that installs from the shared npm-workspace lockfile and builds only `@moundweb/web`.
- `scripts/smoke-deployment.mjs`: remote smoke checks for homepage, robots/sitemap, API liveness and readiness, fail-closed submission status and exact-origin credentialed CORS. It never submits a lead or other personal data.
- `scripts/smoke-deployment.test.mjs`: offline tests for the smoke-check utility.
- CI runs the smoke utility's unit tests. The remote smoke command is manual and requires the actual deployed origins.

## Recommended production topology

- **Frontend:** Vercel, Next.js application in `apps/web`.
- **API:** Render web service described by `render.yaml`.
- **Database:** Neon PostgreSQL. Use the pooled URL for runtime `DATABASE_URL`; use the direct URL for Prisma CLI migrations in `DIRECT_URL`.
- **Email:** Resend, with a sender domain verified before any real inquiry notification is enabled.
- **Domains:** use the website and API on the same registrable domain when possible, such as `www.yourdomain.com` and `api.yourdomain.com`. The admin uses credentialed cookies. Separate provider hostnames such as `.vercel.app` and `.onrender.com` are cross-site and can trigger browser cookie restrictions, so do not enable the admin on that temporary topology without verifying the actual browser behavior.

No live Vercel/Render service, DNS record, Neon migration, initial administrator or Resend delivery is created by this repository commit.

## 1. Verify the release candidate locally

Use Node.js 22.12+ and npm 10+ from the repository root:

```powershell
npm ci
npm run verify
npm audit --audit-level=high
npm run test:deployment
```

CI must be green on the commit you deploy. Do not deploy a local working tree that differs from the tested Git commit.

## 2. Create Neon staging first

1. Create a Neon project and a separate staging branch/database.
2. Copy the **pooled** PostgreSQL connection string into the API environment variable `DATABASE_URL`.
3. Copy the **direct** PostgreSQL connection string into `DIRECT_URL` for Prisma migrations. Keep SSL enabled.
4. Never paste connection strings into GitHub, source files, screenshots, or this chat.

Before production, run the checked-in migrations against staging and verify the admin schema and readiness endpoint. Back up or snapshot production before changing its schema. Use `npm run db:migrate`, not `migrate reset` or `db push`, for the reviewed migration history. Prisma's `migrate deploy` applies pending migrations; it does not replace schema review or a backup.

## 3. Deploy the API on Render

1. Open Render and create a **Blueprint** from `Aayush20253534/MOUNDWEB`, branch `main`. Render detects the repository's `render.yaml`; the Blueprint waits for GitHub checks to pass before automatically deploying a commit.
2. Review the Blueprint before applying it. Select an appropriate service plan based on your availability and budget. The API health check is `/api/health`, a liveness endpoint that works even while the database is being configured.
3. The Blueprint sets `ADMIN_ENABLED=false`, `SUBMISSIONS_ENABLED=false`, `APPROVED_PRIVACY_NOTICE_VERSION=pending`, `ADMIN_COOKIE_SECURE=true` and `TRUST_PROXY=true`. Do not switch the disabled features on yet.
4. Copy the API's Render URL. Later, attach the custom API domain in Render if the site will use a custom domain.

Add the following environment values in **Render → service → Environment**. Values marked as owner-provided must come from your actual providers; do not use the examples literally.

| Variable | Required setting |
|---|---|
| `CLIENT_ORIGIN` | Exact canonical website origin, e.g. `https://www.yourdomain.com`; comma-separated exact origins only if genuinely needed |
| `ADMIN_CLIENT_ORIGIN` | Exact browser origin allowed to sign in to `/admin`, normally the same website origin |
| `DATABASE_URL` | Neon pooled runtime connection string |
| `DIRECT_URL` | Neon direct migration connection string |
| `ADMIN_ENABLED` | `false` until the database and first administrator are ready |
| `ADMIN_COOKIE_SECURE` | `true` in production |
| `ADMIN_COOKIE_SAME_SITE` | `Lax` for the recommended same-site domain setup |
| `TRUST_PROXY` | `true` on Render's single trusted proxy topology; review before changing network topology |
| `SUBMISSIONS_ENABLED` | `false` until every data-collection launch gate is satisfied |
| `APPROVED_PRIVACY_NOTICE_VERSION` | `pending` until the published policy has an approved version |
| `RESEND_API_KEY` | Resend API key, stored only as a protected environment secret |
| `RESEND_FROM_EMAIL` | Sender address on a domain verified in Resend |
| `RESEND_TO_EMAIL` | Approved internal mailbox for inquiry notifications |
| `EDITORIAL_MEDIA_ORIGINS` | Optional comma-separated HTTPS origins only for approved externally-hosted recordings |

Keep the API's health check on `/api/health`. Once Neon is configured and migrations are applied, `/api/ready` should return HTTP 200. A 503 on `/api/ready` means the database is absent or not reachable; it is not a migration command.

## 4. Deploy the frontend on Vercel

1. Import `Aayush20253534/MOUNDWEB` as a new Vercel project and select branch `main`.
2. Set **Root Directory** to `apps/web`. Enable the option to include source files outside the root directory, because npm workspaces and the lockfile live at the repository root.
3. Use the Next.js framework preset and Node.js 22.x. The checked-in `apps/web/vercel.json` runs `npm ci` from the workspace root and builds `@moundweb/web`.
4. Add these environment variables to the Production environment. `NEXT_PUBLIC_*` values are public and used at build time, so redeploy after changing them.

```ini
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_SUBMISSIONS_ENABLED=false
```

Use the exact public website origin in `NEXT_PUBLIC_SITE_URL`, including whether it uses `www`. Use only the HTTPS API origin, without `/api` or any path, for `NEXT_PUBLIC_API_BASE_URL`. Attach your domain through the Vercel domain settings and add only the DNS records that Vercel displays for that domain. After the final hostname is known, update Render's `CLIENT_ORIGIN` and `ADMIN_CLIENT_ORIGIN`, then redeploy the frontend if its URL values changed.

## 5. Apply migrations, then provision the first administrator

First apply the reviewed migration on Neon staging. After it passes, apply the same committed migration history to production using the production direct URL. In the private repository checkout, from PowerShell:

```powershell
$env:DIRECT_URL = Read-Host "Production Neon direct connection string"
$env:DATABASE_URL = Read-Host "Production Neon pooled connection string"
npm run db:migrate
Remove-Item Env:DIRECT_URL, Env:DATABASE_URL
```

Only run this after confirming you are targeting the intended production project/branch, reviewing migrations and taking an appropriate backup. Do not use a development database command against production.

After migration, create the first admin from the same trusted local checkout. The generated password must be at least 14 characters. The password and connection string are requested interactively rather than placed directly in a command:

```powershell
$env:DATABASE_URL = Read-Host "Neon pooled runtime connection string"
$env:ADMIN_BOOTSTRAP_EMAIL = Read-Host "Initial administrator email"
$securePassword = Read-Host "Generated administrator password (14+ characters)" -AsSecureString
$env:ADMIN_BOOTSTRAP_PASSWORD = [System.Net.NetworkCredential]::new("", $securePassword).Password
npm ci
npm run build --workspace @moundweb/shared
npm run build --workspace @moundweb/api
npm run admin:create --workspace @moundweb/api
Remove-Item Env:DATABASE_URL, Env:ADMIN_BOOTSTRAP_EMAIL, Env:ADMIN_BOOTSTRAP_PASSWORD
Remove-Variable securePassword
```

The command provisions the account in the configured Neon database; it does not enable admin access. Verify the account and ADMIN/EDITOR permissions in staging, then set `ADMIN_ENABLED=true` on the API only when the final same-site origin and secure cookie behavior are confirmed. Do not leave bootstrap credentials in the host environment, shell history or saved logs.

## 6. Keep real inquiry collection disabled until approved

Before accepting personal information, all of the following must be complete: the published and legally reviewed privacy notice; confirmed purpose, retention and deletion handling; Neon migration and backup; verified Resend sender/recipient and a successful staging notification test; exact CORS origins; and a consented internal smoke test. Only then:

1. Set the exact published notice version in `APPROVED_PRIVACY_NOTICE_VERSION`.
2. Set `SUBMISSIONS_ENABLED=true` in Render.
3. Verify `GET /api/submission-status` returns `enabled: true` and the approved version.
4. Set `NEXT_PUBLIC_SUBMISSIONS_ENABLED=true` in Vercel Production and redeploy the frontend.

Do not enable one side before the other side is ready. The API intentionally fails closed when a dependency or approved notice is missing. Never use real applicant/customer data as a test payload.

## 7. Run post-deployment smoke checks

After the website and API have their final HTTPS domains and the database is ready, run from the repository root:

```powershell
$env:SITE_URL = "https://www.yourdomain.com"
$env:API_URL = "https://api.yourdomain.com"
npm run smoke:deployment
Remove-Item Env:SITE_URL, Env:API_URL
```

The default command **requires database readiness** and verifies the homepage, robots.txt, sitemap origin, API liveness, database readiness, fail-closed submission status and credentialed CORS preflight. It never submits form data.

For an early infrastructure-only check before the database exists, you may run:

```powershell
npm run smoke:deployment -- --skip-database-check
```

That deliberately reports database readiness as skipped. It is not production release acceptance. Re-run the default command once the migrations and database are working. Also manually sign in to `/admin` in a real browser, test logout/session expiry and role separation, inspect Resend delivery in staging, and review CSP, DNS, redirects, mobile layout and a restore plan.

## 8. Release, rollback and scale

- Treat a green GitHub Actions run as the code gate, not proof that production credentials or external services work.
- Keep the deployed Git commit identifiable in Vercel and Render. If the frontend deployment fails, use Vercel's deployment rollback/promote-previous-deployment controls. If the API deploy fails, restore the previous healthy Render deployment or deploy its previous commit.
- A code rollback does not automatically roll back a database migration. Use backward-compatible migrations and a tested backup/restore plan.
- Before scaling API replicas, replace the in-memory submission/admin rate limiter with shared/distributed rate limiting or a WAF. Add alerts for sustained 5xx, failed mail delivery, admin login failures and readiness failures.
- Keep provider API keys, Neon URLs and bootstrap passwords out of Git and build logs. Rotate any secret exposed in a command transcript.

## Official provider documentation

- [Vercel monorepos](https://vercel.com/docs/monorepos)
- [Render Blueprint specification](https://render.com/docs/blueprint-spec)
- [Render web services](https://render.com/docs/web-services)
- [Prisma migrate deploy](https://www.prisma.io/docs/cli/v7/migrate/deploy)
