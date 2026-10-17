# MOUNDWEB implementation roadmap

| Part | Scope | State |
| ---- | ----- | ----- |
| 00 | Next.js/Express/shared npm workspace, TypeScript, health API, CI | Preserved; lint/configuration repaired and reproducible lockfile added |
| 01 | Design tokens, typography, brand, navigation, reusable UI and page foundations | Implemented |
| 02 | Original artwork, optimized assets, fonts, icons, texture maps and manifest | Implemented |
| 03 | Particle mountain formation, exactly three impacts, explosion and MOUNDWEB reveal | Implemented; GPU renderer and handoff in `PART_03_MOUNTAIN.md`; browser visual QA pending |
| 04 | Genuine revolving Earth, orbital behavior and homepage motion | Implemented; WebGL2 globe, six 3D-projected orbits, scroll motion; see `PART_04_GLOBE.md` |
| 05 | About content approval and page-specific motion | Page-specific motion and illustrated approach timeline implemented; factual content approval pending |
| 06 | Programs content, admissions details and enrollment behavior | Filterable paths, 11 draft guides and course inquiry prefill complete; real backend/approval pending |
| 07 | Digital marketing services and advertising | Six detail pages, goal explorer, and standalone Advertising Coming Soon implemented; business content approval pending |
| 08 | Contact and college/franchise partnerships | Contact route picker, college/franchise draft forms, validation/copy and motion complete; live delivery and verified contact details pending |
| 09 | Podcast and media publishing | Podcast/Media galleries, filters, draft routes and gated native player implemented; verified recordings and CMS pending |
| 10 | Careers and training/placement records | Careers explorer and training methodology/reporting UI implemented; verified postings and application backend pending |
| 11 | Neon/Prisma, REST business APIs and Resend | Schema, opt-in API, validation, resilient notifications and frontend integration implemented; credentials/migrations pending |
| 12 | Admin dashboard | Implemented: Argon2id login, hashed/expiring sessions, ADMIN/EDITOR role separation, private lead workflow, audit records and editorial CMS; remote migration/provisioning pending |
| 13 | Final responsive and motion polish | Shared route transitions, safe-area and touch polish; 22-route ten-width matrix and all 94 browser tests passed in CI (`ea640e1`) |
| 14 | Security, final SEO, deployment and release | Next/Prisma/Vitest upgraded, admin/SEO/headers/readiness hardened, npm audit reports zero advisories; real staging/credential smoke tests pending |
| 15 | Production deployment kit and release verification | Implemented: Render Blueprint, Vercel workspace build configuration, deployment runbook and no-PII remote smoke checker with unit tests; actual hosting/DNS/database/email setup pending |

## Content required before launch

Confirmed contact channels, address and hours; approved course curricula, fees, delivery modes and eligibility; partnership terms; real team profiles; verified testimonials and client permissions; audited training/placement definitions and records; real podcast/media/career content; approved legal policies.

The website never advertises Website Development as a client service. AI marketing courses remain within Digital Marketing. Unverified claims from the image mockups are replaced with explicit pending states or clearly illustrative measurement content.

## Continuation

Parts 00–15 now have implementation work in `main`. The dependency audit and full CI must pass on the exact commit you deploy. Do not enable admin or public submissions until the real Neon migration, secure admin provisioning, approved privacy policy, verified Resend configuration, correct same-site cookie/origin settings and staging smoke tests have succeeded. No remote database migration or real email delivery is claimed by these code changes. Keep the in-memory rate limiter limitation in view before scaling to multiple API replicas.
