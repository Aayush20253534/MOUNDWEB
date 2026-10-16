# MOUNDWEB implementation roadmap

| Part | Scope                                                                             | State                                                                                             |
| ---- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 00   | Next.js/Express/shared npm workspace, TypeScript, health API, CI                  | Preserved; lint/configuration repaired and reproducible lockfile added                            |
| 01   | Design tokens, typography, brand, navigation, reusable UI and page foundations    | Implemented                                                                                       |
| 02   | Original artwork, optimized assets, fonts, icons, texture maps and manifest       | Implemented                                                                                       |
| 03   | Particle mountain formation, exactly three impacts, explosion and MOUNDWEB reveal | Implemented; GPU renderer and handoff in `PART_03_MOUNTAIN.md`; browser visual QA pending                                                          |
| 04   | Genuine revolving Earth, orbital behavior and homepage motion                     | Not started; static stage and textures ready                                                      |
| 05   | About content approval and page-specific motion                                   | Responsive layout complete; verified content/motion pending                                       |
| 06   | Programs content, admissions details and enrollment behavior                      | Two paths and 11 course templates complete; approval/integration pending                          |
| 07   | Digital marketing services and advertising                                        | Six service layouts and Coming Soon banner complete; business content approval pending            |
| 08   | Contact and college/franchise partnerships                                        | Layouts and local inquiry review complete; message delivery and confirmed contact details pending |
| 09   | Podcast and media publishing                                                      | Reusable editorial templates complete; verified content/player/CMS pending                        |
| 10   | Careers and training/placement records                                            | Honest empty-state templates complete; verified records/application flows pending                 |
| 11   | Neon/Prisma, REST business APIs and Resend                                        | Not started                                                                                       |
| 12   | Admin dashboard                                                                   | Not started                                                                                       |
| 13   | Final responsive and motion polish                                                | Static foundation verified at five widths; animated flows require later verification              |
| 14   | Security, final SEO, deployment and release                                       | Not started; do not infer production launch readiness from the frontend build                     |

## Content required before launch

Confirmed contact channels, address and hours; approved course curricula, fees, delivery modes and eligibility; partnership terms; real team profiles; verified testimonials and client permissions; audited training/placement definitions and records; real podcast/media/career content; approved legal policies.

The website never advertises Website Development as a client service. AI marketing courses remain within Digital Marketing. Unverified claims from the image mockups are replaced with explicit pending states or clearly illustrative measurement content.

## Continuation

Start Part 03 from the verified `main` commit accompanying this delivery. Preserve the design system, page structure, asset paths, content constraints, and accessible DOM. Implement the particle renderer inside `ParticleMountainStage`; continue with `OrbitGlobeStage` in Part 04. Do not restart the frontend from a new template.
