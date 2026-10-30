# MOUNDWEB

Premium digital marketing, brand growth and professional-learning website. This repository contains the Next.js frontend, Express API, shared TypeScript package, Neon/PostgreSQL Prisma schema, responsive visual experience, editorial CMS and protected admin foundation.

## Run locally

Use Node.js 22.12+ and npm 10+:

```sh
npm ci
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev:web
```

In a second terminal, run `npm run dev:api`. The frontend is `http://localhost:3000`; the API liveness endpoint is `http://localhost:4000/api/health`. A database is not needed to inspect pages, but admin and persistent submissions require the configured Neon database.

## Verify

```sh
npm run verify
npm audit --audit-level=high
npm run test:deployment
npx playwright install chromium
npm run test:browser
```

The workflow performs dependency installation and Prisma generation, lint, strict TypeScript, unit tests, production builds, the npm high-severity audit gate, deployment smoke utility tests and Playwright browser tests. Responsive checks cover 22 routes at widths from 320px through 1920px, with automated mobile/desktop WCAG checks.

## Important routes

- `/` — animated mountain impact and brand-growth home.
- `/services`, `/services/[slug]` — brand-growth service pages; web development is a course category, not a client service.
- `/programs`, `/programs/[slug]` — training tracks.
- `/contact`, `/partners/colleges`, `/partners/franchise` — inquiry review and partnership previews.
- `/podcast`, `/media` — editorial concepts plus verified published releases from the API when configured.
- `/career`, `/training-placements` — career areas and verified-outcome framework.
- `/admin` — noindex private admin console, disabled at the API until an operator enables it after provisioning.

## Admin, database and live submissions

See [Part 11 Backend](docs/PART_11_BACKEND.md), [Part 12 Admin](docs/PART_12_ADMIN.md), [Part 14 Security & Release](docs/PART_14_SECURITY_RELEASE.md), and [Part 15 Deployment](docs/PART_15_DEPLOYMENT.md). No default admin account exists. Provision one through the documented secure bootstrap command after reviewing/applying migrations; never commit its password.

**Keep `ADMIN_ENABLED=false` and both submission flags false until real environment setup is complete.** The repository cannot apply a remote Neon migration, verify a Resend domain, or send real production mail without owner-controlled credentials. An API receipt is not an enrollment, placement, contract, or partnership approval.

## Deployment

The repository now includes a Render Blueprint for the API (`render.yaml`), Vercel monorepo configuration (`apps/web/vercel.json`), and a post-deployment check. After deploying the frontend and API, configure the actual environment variables and run:

```powershell
$env:SITE_URL = "https://www.yourdomain.com"
$env:API_URL = "https://api.yourdomain.com"
npm run smoke:deployment
Remove-Item Env:SITE_URL, Env:API_URL
```

The full check expects API/database readiness. Use `npm run smoke:deployment -- --skip-database-check` only for an early infrastructure check; it is not production launch approval. Follow the Part 15 runbook before enabling the admin or personal-data collection.

## Dependency security baseline (2026-10-30)

The CI security gate is deliberately enforced with `npm audit --audit-level=high`.
The dependency tree includes `zod@4.6.7`, `resend@6.35.0`,
`body-parser@1.20.9`, and `fast-uri@3.1.9`, resolving the reported
security advisories without using `--force` or suppressing the audit.
The package-lock is committed for reproducible `npm ci` installations.
Run `npm run verify && npm audit --audit-level=high && npm run test:deployment`
when modifying dependencies.

## Handoff and asset references

### Social profiles

The global footer and Contact page share the Instagram, Facebook and LinkedIn
icons configured in `apps/web/src/lib/social-profiles.ts`. The MOUNDWEB owner
provided these links on October 29, 2026:

- Instagram: https://www.instagram.com/mound_web/
- Facebook: https://www.facebook.com/share/1A55kyXKqC/

The Facebook share URL is preserved exactly as supplied. LinkedIn stays visible
with a `null` URL at the owner's request until its profile link is supplied;
it is noninteractive and labeled as not yet available. YouTube is not displayed.

To activate a profile, obtain its exact HTTPS URL from the MOUNDWEB owner, verify
that it is the intended account, and replace that platform's `null` value. Leave
unconfirmed platforms as `null`. Both locations update together; confirmed links
open in a new tab with accessible labels, visible keyboard focus and touch targets
of at least 44px. Record the owner confirmation in the change description.

### References

- [Design system](docs/DESIGN_SYSTEM.md)
- [Asset manifest](docs/ASSET_MANIFEST.md)
- [Visual QA and screenshots](docs/VISUAL_QA.md)
- [Parts 03–04 animation handoff](docs/ANIMATION_HANDOFF.md)
- [Roadmap](docs/ROADMAP.md)

Unverified testimonials, addresses, contact numbers, fees, placement counts, client logos and business results are not presented as facts. Actual public editorial content requires reviewed source material and passing publication gates.

## Search optimization

See [SEO runbook](docs/SEO.md). Canonical site: https://www.moundweb.tech; sitemap: https://www.moundweb.tech/sitemap.xml; robots: https://www.moundweb.tech/robots.txt. Business location and Google Search Console verification require owner-approved data.
