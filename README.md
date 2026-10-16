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
npx playwright install chromium
npm run test:browser
```

The workflow performs dependency installation and Prisma generation, lint, strict TypeScript, unit tests, production builds, the npm high-severity audit gate and Playwright browser tests. Responsive checks cover 22 routes at widths from 320px through 1920px, with automated mobile/desktop WCAG checks.

## Important routes

- `/` — animated mountain impact and brand-growth home.
- `/services`, `/services/[slug]` — brand-growth service pages; web development is a course category, not a client service.
- `/programs`, `/programs/[slug]` — training tracks.
- `/contact`, `/partners/colleges`, `/partners/franchise` — inquiry review and partnership previews.
- `/podcast`, `/media` — editorial concepts plus verified published releases from the API when configured.
- `/career`, `/training-placements` — career areas and verified-outcome framework.
- `/admin` — noindex private admin console, disabled at the API until an operator enables it after provisioning.

## Admin, database and live submissions

See [Part 11 Backend](docs/PART_11_BACKEND.md), [Part 12 Admin](docs/PART_12_ADMIN.md), and [Part 14 Security & Release](docs/PART_14_SECURITY_RELEASE.md). No default admin account exists. Provision one through the documented secure bootstrap command after reviewing/applying migrations; never commit its password.

**Keep `ADMIN_ENABLED=false` and both submission flags false until real environment setup is complete.** The repository cannot apply a remote Neon migration, verify a Resend domain, or send real production mail without owner-controlled credentials. An API receipt is not an enrollment, placement, contract, or partnership approval.

## Handoff and asset references

- [Design system](docs/DESIGN_SYSTEM.md)
- [Asset manifest](docs/ASSET_MANIFEST.md)
- [Visual QA and screenshots](docs/VISUAL_QA.md)
- [Parts 03–04 animation handoff](docs/ANIMATION_HANDOFF.md)
- [Roadmap](docs/ROADMAP.md)

Unverified testimonials, addresses, contact numbers, fees, placement counts, client logos and business results are not presented as facts. Actual public editorial content requires reviewed source material and passing publication gates.