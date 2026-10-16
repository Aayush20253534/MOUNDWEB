# Part 12 — Admin Dashboard and Editorial CMS

## Delivered

- Private `/admin` control center with noindex/nofollow/nocache metadata, no public signup and an operator-provisioned account model.
- Argon2id password verification; random session token generated server-side; SHA-256 token digest only is stored in Neon; eight-hour expiry; server-side revocation; HttpOnly, SameSite cookie; no browser localStorage token.
- ADMIN and EDITOR roles. ADMIN can review inquiries and partnership records; EDITOR can work on Podcast/Media content but cannot list or view personal inquiry data.
- Contact/partnership workflow with status, internal note, pagination limits and audit records. No bulk export, public personal-data listing or destructive delete endpoint.
- Database-backed editorial drafts and publishing UI. Podcast entries require allow-listed HTTPS or local audio, verified positive duration and accessible transcript before release. Media needs a named author and nonempty article text. Public API returns only eligible PUBLISHED records.
- Podcast/Media catalogs and dynamic detail pages query the API and validate the payload before displaying approved releases. Existing sample concepts remain clearly labeled as unpublished drafts.
- Admin auth is disabled by default. No default admin account, hard-coded password or public registration endpoint exists.

## First deployment and provisioning

1. Create Neon PostgreSQL staging/production databases. Keep `DATABASE_URL` for runtime (the Neon pooled connection) and set `DIRECT_URL` to the direct connection for Prisma migrations where available.
2. On the API service, set `ADMIN_ENABLED=false` initially, plus exact frontend origins in `CLIENT_ORIGIN` and `ADMIN_CLIENT_ORIGIN`. Set `ADMIN_COOKIE_SECURE=true` in production. Do not add a cookie domain unless there is a deliberate multi-subdomain design.
3. Install/build from the checked-in lockfile. Apply the reviewed migrations using `npm run db:migrate`. The lifecycle preflight intentionally fails when neither `DIRECT_URL` nor `DATABASE_URL` is configured.
4. Build the API first, then provision the first administrator from a secure shell/session using `ADMIN_BOOTSTRAP_EMAIL` and a generated 14+ character `ADMIN_BOOTSTRAP_PASSWORD`:

```sh
npm run build --workspace @moundweb/api
ADMIN_BOOTSTRAP_EMAIL=admin@example.com ADMIN_BOOTSTRAP_PASSWORD='use-a-generated-secret-here' npm run admin:create --workspace @moundweb/api
```

PowerShell equivalent:

```powershell
$env:ADMIN_BOOTSTRAP_EMAIL = 'admin@example.com'
$env:ADMIN_BOOTSTRAP_PASSWORD = '<generated-secret-of-at-least-14-characters>'
npm run build --workspace @moundweb/api
npm run admin:create --workspace @moundweb/api
Remove-Item Env:ADMIN_BOOTSTRAP_PASSWORD
```

Do not put the bootstrap password into source control, a saved command transcript or a public CI variable. Rotate/remove the bootstrap secret immediately after provisioning.
5. Verify login/logout, blocked anonymous routes, the role separation, audit records and content publication gates in staging.
6. Enable `ADMIN_ENABLED=true` only after migration and provisioning have succeeded. Configure `NEXT_PUBLIC_API_BASE_URL` in the web build to the HTTPS API origin and redeploy.

## Cookie, origin and proxy requirements

The backend checks exact allowed `Origin` values on login/logout/mutations, uses credentialed CORS, stores token digests rather than raw tokens, limits login attempts, and sends no-store headers for private responses. Prefer a same-site custom domain or reverse proxy for the website and API. Cross-site cookies can be blocked by modern browser privacy protections; `SameSite=None` requires Secure and does not override third-party-cookie blocking. Do not use a permissive origin wildcard with credentials.

`TRUST_PROXY=true` enables trust for one proxy hop. Set it only when the deployed topology is exactly a single trusted reverse proxy or change the trust configuration to match the actual proxy chain. The in-memory request limiter is per process; before scaling across replicas, add a shared rate limiter/WAF and operational alerting.

## Pending operations

- The checked-in Part 12 migration has not been applied to a real Neon database in this build.
- The initial admin account has not been created because no production database or credentials were supplied.
- No live inquiries, private data, episode recordings or press/article records have been created by these changes.
- Admin/editor accounts need operator approval and a documented offboarding/password-rotation process. The audit table is not yet wired to an external SIEM.

## Verification

API tests exercise disabled-by-default administration, origin controls, login failures, cookie/session revocation, ADMIN/EDITOR roles, lead status updates, publication checks and readiness. The all-route Playwright suite includes `/admin` in the ten-width matrix. Full release acceptance also requires a private Neon staging migration and manual sign-in smoke test; CI does not claim to exercise real database credentials.