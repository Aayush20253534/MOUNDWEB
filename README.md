# MOUNDWEB

Part 00: production-oriented foundation for the MOUNDWEB agency and training website.

## Stack
- Next.js 15 / React 19 / TypeScript frontend (`apps/web`)
- Node.js / Express / TypeScript REST API (`apps/api`)
- Shared TypeScript contracts (`packages/shared`)
- Planned: Neon PostgreSQL, Prisma, Resend, GSAP, React Three Fiber (introduced in later parts)

## Local development
Requires Node.js 22 and npm 10+.

```sh
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev:web
# In another terminal:
npm run dev:api
```

Web: http://localhost:3000 · API: http://localhost:4000/api/health

Run all checks: `npm run verify`.

No database, email, or paid API is required for the Part 00 placeholder to run. Do not commit secrets.

## Part boundaries
Part 00 initializes the technical foundation and a branded placeholder. It does **not** implement final mockup pages, animations, forms, Prisma migrations, or Resend integrations. These arrive in subsequent parts. See `docs/ROADMAP.md`.
