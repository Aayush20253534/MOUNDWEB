# Part 14 — Security, SEO, Deployment and Release Hardening

## Implemented in code

- Updated Next.js and `eslint-config-next` from the vulnerable prior dependency tree to Next.js `16.4.2` and aligned React to `19.2.0`.
- Upgraded Prisma and `@prisma/client` to `7.10.1`, with the Prisma 7 custom generated client, a Neon driver adapter, separate runtime and migration connection strings, and a migration preflight guard.
- Updated all three workspace test environments to Vitest `5.0.5`; removed the vulnerable lint-preset dependency chain and use ESLint flat config directly with `@eslint/js` and `typescript-eslint`.
- Added a CI gate `npm audit --audit-level=high`; the dependency maintenance workflow refreshes the lockfile, attempts compatible audit fixes and uploads the JSON audit report.
- The latest dependency-audit artifact for the updated dependency graph recorded 0 info, 0 low, 0 moderate, 0 high and 0 critical findings across 575 resolved packages. The fresh complete verification run must pass before release.
- Production-oriented Next.js response headers include CSP, HSTS, frame denial, `nosniff`, referrer policy, Permissions Policy and Cross-Origin-Opener-Policy.
- Root metadata supports validated `NEXT_PUBLIC_SITE_URL`; sitemap paths include the actual service/course routes and only include Podcast/Media listing/detail URLs when approved editorial content exists. `/admin` is marked noindex/nofollow/nocache.
- Added a database reachability endpoint (`GET /api/ready`) that returns 503 when the database is not configured/reachable; `/api/health` remains a separate process liveness endpoint.
- `npm run db:migrate` runs a preflight check. Prisma CLI migrations prefer `DIRECT_URL`; API runtime uses `DATABASE_URL` with the Neon serverless adapter.

## Release configuration

### API (Render or another trusted Node host)

```ini
PORT=4000
CLIENT_ORIGIN=https://www.example.com
ADMIN_CLIENT_ORIGIN=https://www.example.com
DATABASE_URL=<Neon runtime pooled connection string>
DIRECT_URL=<Neon direct connection string>
ADMIN_ENABLED=false
ADMIN_COOKIE_SECURE=true
ADMIN_COOKIE_SAME_SITE=Lax
TRUST_PROXY=true
SUBMISSIONS_ENABLED=false
APPROVED_PRIVACY_NOTICE_VERSION=pending
RESEND_API_KEY=<secret manager value>
RESEND_FROM_EMAIL=<verified sender>
RESEND_TO_EMAIL=<approved internal recipient>
EDITORIAL_MEDIA_ORIGINS=<comma-separated HTTPS origins, only if external audio is used>
```

### Frontend (Vercel)

```ini
NEXT_PUBLIC_SITE_URL=https://www.example.com
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_SUBMISSIONS_ENABLED=false
```

Use the exact production origin in the API origin allow-list. Configure all secrets as protected environment variables in the hosting provider, never in this repository. Public `NEXT_PUBLIC_*` values are build-time settings and require redeployment after updates.

## Required release checklist

- Run `npm ci`, `npm run verify`, `npm audit --audit-level=high`, install Chromium and run `npm run test:browser` on the final lockfile/HEAD.
- Apply the reviewed migration to a staging Neon branch first and verify `/api/ready`; do not perform a reset or drop production tables.
- Provision a real administrator through the secured bootstrap command. Smoke-test roles, sessions, revocation and the audit log in staging.
- Verify Resend sender/domain/recipient and test one consented inquiry after the privacy notice is approved; inspect database storage and notification status.
- Confirm CSP and external media allowances against the deployed assets and any actual third-party integrations. HSTS with `includeSubDomains` assumes every affected subdomain supports HTTPS.
- Inspect title/description/canonical metadata, robots, sitemap, structured links, favicon/manifest, 404s, redirects, internal links and mobile/desktop rendering on the deployed domain.
- Review backup/restore, retention/deletion, incident response, credential rotation, shared/distributed rate limiting and hosting log access before enabling live intake.

## Security boundaries still requiring organization input

- Production deployment and remote Neon migrations were not executed because this build was not given production credentials or access to the owner-controlled environments.
- Resend credentials/sender-domain verification and a real delivery smoke test remain pending.
- Legal/business owners must approve the privacy policy, consent text/version, data retention and erasure process, and determine whether any training inquiry could relate to a minor before public collection is enabled.
- The admin rate limiter is in-memory and therefore not sufficient alone for multi-replica production. Add a shared distributed limit or edge WAF before scaling.
- The CSP intentionally permits inline script/style needed by this current Next app. A stricter nonce-based CSP requires a separate review of Next rendering and animation requirements.
- Audit log retention/monitoring, incident alerts and automated scheduled cleanup are still operational responsibilities; code-level audit records do not replace a documented policy.

## Current release stance

Part 12 admin and Part 14 hardening are implemented in the repository; **production launch is not declared complete** until the fresh full CI run passes and the staging migration/login/Resend/privacy checks above are performed. Keep `ADMIN_ENABLED=false`, `SUBMISSIONS_ENABLED=false`, and `NEXT_PUBLIC_SUBMISSIONS_ENABLED=false` until the real environment has been prepared and reviewed.