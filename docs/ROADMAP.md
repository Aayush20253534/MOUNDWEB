# MOUNDWEB implementation roadmap

| Part | Scope                                                                             | State                                                                                             |
| ---- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 00   | Next.js/Express/shared npm workspace, TypeScript, health API, CI                  | Preserved; lint/configuration repaired and reproducible lockfile added                            |
| 01   | Design tokens, typography, brand, navigation, reusable UI and page foundations    | Implemented                                                                                       |
| 02   | Original artwork, optimized assets, fonts, icons, texture maps and manifest       | Implemented                                                                                       |
| 03   | Particle mountain formation, exactly three impacts, explosion and MOUNDWEB reveal | Implemented; GPU renderer and handoff in `PART_03_MOUNTAIN.md`; browser visual QA pending                                                          |
| 04   | Genuine revolving Earth, orbital behavior and homepage motion                     | Implemented; WebGL2 globe, six 3D-projected orbits, scroll motion; see `PART_04_GLOBE.md`                                                      |
| 05   | About content approval and page-specific motion                                   | Page-specific motion and illustrated approach timeline implemented; factual content approval pending                                       |
| 06   | Programs content, admissions details and enrollment behavior                      | Filterable paths, 11 draft guides and course inquiry prefill complete; real backend/approval pending                          |
| 07   | Digital marketing services and advertising                                        | Six detail pages, goal explorer, and standalone Advertising Coming Soon implemented; business content approval pending            |
| 08   | Contact and college/franchise partnerships                                        | Contact route picker, college/franchise draft forms, validation/copy and motion complete; live delivery and verified contact details pending |
| 09   | Podcast and media publishing                                                      | Podcast/Media galleries, filters, draft routes and gated native player implemented; verified recordings and CMS pending                        |
| 10   | Careers and training/placement records                                            | Careers explorer and training methodology/reporting UI implemented; verified postings and application backend pending                 |
| 11   | Neon/Prisma, REST business APIs and Resend                                        | Schema, opt-in API, validation, resilient notifications and frontend integration implemented; credentials/migrations pending |
| 12   | Admin dashboard                                                                   | Not started                                                                                       |
| 13   | Final responsive and motion polish                                                | Shared route transitions, safe-area and touch polish; 22-route ten-width matrix and all 94 browser tests passed in CI (`ea640e1`)              |
| 14   | Security, final SEO, deployment and release                                       | Not started; do not infer production launch readiness from the frontend build                     |

## Content required before launch

Confirmed contact channels, address and hours; approved course curricula, fees, delivery modes and eligibility; partnership terms; real team profiles; verified testimonials and client permissions; audited training/placement definitions and records; real podcast/media/career content; approved legal policies.

The website never advertises Website Development as a client service. AI marketing courses remain within Digital Marketing. Unverified claims from the image mockups are replaced with explicit pending states or clearly illustrative measurement content.

## Continuation

Continue from the current `main` branch. Parts 00–11 and Part 13 have been implemented; Part 12 (Admin Dashboard) remains not started and Part 14 (security, SEO, deployment and release) remains not started. Keep Part 11 submissions disabled until the approved privacy policy, Neon migrations and verified Resend configuration have passed a staging smoke test. Part 13's 22-route responsive/accessibility suite must pass before the frontend polish can be called complete. Do not present editorial drafts, missing placement figures or unreleased media as verified publications.
