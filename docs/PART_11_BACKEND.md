# Part 11 — Express + Neon PostgreSQL + Prisma + Resend

## Implemented

The existing Node/Express API now supports the following REST endpoints:

| Endpoint | Method | Semantics |
|---|---|---|
| /api/health | GET | Public liveness check; not DB readiness |
| /api/submission-status | GET | No-cache readiness and approved privacy-notice version |
| /api/v1/inquiries | POST | Contact/program/career/media/marketing inquiry |
| /api/v1/partnerships | POST | Institution or franchise inquiry |

Submissions are disabled by default at both the Next.js frontend and Express backend. When enabled, the Contact and Partnership review dialogs show a **second, explicit consent checkbox**, an actual Submit button, an in-progress state and a server-confirmed receipt. Merely clicking **Review** never submits.

The server uses strict Zod validation, 15 KB JSON limit, exact-origin checking for POST, Origin-bound CORS, standard helmet headers, a honeypot and per-instance request throttling. It requires approved privacy notice version, configured Neon DATABASE_URL and verified Resend sender, recipient and key before allowing data collection.

The Prisma schema contains private InquirySubmission and PartnershipSubmission tables. Client-generated UUID request IDs are unique for retry idempotency. Server-side persistence happens **before** Resend notification. Notification status is stored separately. A failed email does **not** cause a false delivery claim; the API acknowledges only when the database record is durably accepted. Failures to store return 503. The API never returns inquiry contents or personal information.

The existing copy-only workflows remain available, and unchanged by default. No enrollment, employment offer, franchise approval, or placement result is implied by an inquiry receipt.

## Environment values

### apps/api/.env

\`\`\`ini
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://<user>:<password>@<neon-host>/<db>?sslmode=require
SUBMISSIONS_ENABLED=false
APPROVED_PRIVACY_NOTICE_VERSION=pending
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TO_EMAIL=
TRUST_PROXY=false
\`\`\`

**Production:** HTTPS-only CLIENT_ORIGIN matching Vercel site, actual Neon pooled PostgreSQL connection string, RESEND_FROM_EMAIL verified with Resend, authenticated receiving mailbox in RESEND_TO_EMAIL, TRUST_PROXY=true behind a single trusted reverse proxy. Never commit credentials, connection strings or actual applicant information.

### apps/web/.env.local

\`\`\`ini
NEXT_PUBLIC_SUBMISSIONS_ENABLED=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
\`\`\`

On Vercel use the HTTPS URL of the Render backend, without a path. Public variables are **build-time settings** and require redeployment after changing.

## Setup (after receiving secrets and approved policies)

1. Publish a legally reviewed privacy policy at \`/privacy\`, including purposes, retention, lawful basis, contact details, consent withdrawal/erasure mechanism, subcontractors/transfers and age-related safeguards as applicable.
2. Provision Neon and fill DATABASE_URL securely on Render. Run \`npm ci\` and \`npm run db:generate\`, then \`npm run db:migrate\` **after review** to apply the checked-in Prisma migration.
3. Verify Resend sending domain and configure RESEND_API_KEY, RESEND_FROM_EMAIL and RESEND_TO_EMAIL securely. Test notification delivery in a private staging environment.
4. Set APPROVED_PRIVACY_NOTICE_VERSION to the exact published policy version, not "pending"; then enable SUBMISSIONS_ENABLED=true **on the backend**. Check GET /api/submission-status. This must remain false when a dependency or approved policy is missing.
5. Set NEXT_PUBLIC_SUBMISSIONS_ENABLED=true on the frontend along with NEXT_PUBLIC_API_BASE_URL and redeploy. The frontend additionally checks live backend readiness before displaying the submission control.
6. Test one staging inquiry and one staging partnership with explicit consent and inspect Neon persistence + Resend delivery status. Verify CORS, CSP/reverse proxy, rate-limiting, retention and data-deletion behavior before going live.

## Security and operational limitations

This is the first production-shaped persistence integration, not a final compliance or security signoff. The rate limiter is **in-memory per Express replica**, so put a shared distributed limiter or WAF upstream before scaling and configure the proxy count correctly. Submission email-status retries, monitoring/alerting, database-driven retention and deletion, admin access control and auditing will be added in Part 12 or required launch hardening.

A web-visitor-origin header check and CORS are defense-in-depth, not authentication. Admin CRUD/publication endpoints are **not** implemented here. No record-listing or PII-reading public routes exist.

API readiness currently validates configuration presence, not an actual DB/Resend connectivity handshake. Check those separately in deployment smoke tests.

Avoid storing data about minors until appropriate guardian flow is approved. The existing AI Digital Ninja course inquiry should not include student details in the note.

**Never** paste or upload the Neon URL, Resend key, user submissions, or private email addresses to a public issue, build log or screenshot.

## Verification

\`\`\`sh
npm ci
npm run db:generate
npm run verify
npm run test:browser
\`\`\`

API tests include disabled-by-default status, contact/partnership validation, exact-origin/consent/notice checks, idempotency primitives, storage failure, and email failure behavior. Frontend browser tests maintain local-review-only mode by default. True end-to-end testing with Neon/Resend requires real staging credentials and cannot be asserted from CI without them.

## Pending

Real Neon database credentials, Resend credentials, an approved privacy policy and receiving team email must come from the organization. Database migrations have not been executed on any remote Neon instance by this implementation. No user data has been submitted by this build.

The npm lockfile was regenerated and committed by the dedicated Part 11 GitHub Actions workflow after adding Prisma and Resend dependencies.
