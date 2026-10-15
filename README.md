# MOUNDWEB

Cinematic digital marketing and professional learning website. Parts 00–02 include the existing Next.js/Express monorepo, responsive design system, five approved page foundations, supporting templates, eleven course pages, and an original optimized asset library.

## Run locally

Node.js 22 or 24, npm 10+:

```bash
npm ci
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev:web
# In another terminal:
npm run dev:api
```

Frontend: `http://localhost:3000`. API health: `http://localhost:4000/api/health`.

No database, email credential, remote font, or external image service is required to review Parts 01–02. The contact form validates and reviews an inquiry locally; it does not send or save it.

## Verify

```bash
npm run verify
npx playwright install chromium
npm run test:browser
```

`verify` runs lint, strict TypeScript validation, available unit tests, and production builds for shared/API/web workspaces. Browser tests start the production server automatically and cover five pages at 375, 768, 1024, 1440, and 1920px; WCAG checks; navigation; form review; internal links; assets; and reduced motion. CI uses `npm ci` and retains browser artifacts.

## Routes

`/`, `/about`, `/programs`, `/services`, `/contact`, `/podcast`, `/media`, `/career`, `/training-placements`, `/partners`, `/partners/colleges`, `/partners/franchise`, `/programs/[slug]`, `/privacy`, `/terms`.

`/design-system` is a noindex component gallery. Supporting publishing, records, legal, and career pages clearly state pending content. No sample testimonials, addresses, contact numbers, placements, or business results are represented as facts.

## Handoff

- [Design system](docs/DESIGN_SYSTEM.md)
- [Asset manifest](docs/ASSET_MANIFEST.md)
- [Visual QA and screenshots](docs/VISUAL_QA.md)
- [Parts 03–04 animation handoff](docs/ANIMATION_HANDOFF.md)
- [Roadmap](docs/ROADMAP.md)

Major mountain and Earth animations are deliberately deferred. Static scene boundaries, posters, sprites, masks, and globe textures are ready for the next parts. Web Development is a course category, not a client service.
