# MOUNDWEB

Part 00 foundation for the MOUNDWEB digital marketing and training website.

## Stack
- Next.js 15, React 19, TypeScript (`apps/web`)
- Express, Node.js, TypeScript (`apps/api`)
- Shared typed contracts (`packages/shared`)
- Planned for later parts: Neon PostgreSQL, Prisma, Resend, Three.js, GSAP

## Setup
Requires Node.js 22 and npm 10+.

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev:web
# Another terminal
npm run dev:api
```

Frontend: http://localhost:3000
API health: http://localhost:4000/api/health

Run `npm run verify` for lint, type checking, tests, and builds.

Part 00 is a working scaffold, not final pages or production integration. See `docs/ROADMAP.md`.
