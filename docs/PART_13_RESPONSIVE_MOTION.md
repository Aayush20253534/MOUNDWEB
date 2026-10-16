# Part 13 — Global Motion and Responsive Quality

## Delivered

- A shared route-arrival animation for client-side navigation. It fades and translates the main content by a few pixels; it is not a screen-level loading overlay and does not delay route rendering. It detects \`prefers-reduced-motion\` and does not start a Web Animation when reduced motion is requested.
- Responsive header navigation now closes if browser back/forward changes the route. Dropdown panels use generated stable IDs, their \`aria-controls\` values are valid, and nested pages keep the corresponding section highlighted.
- Viewport metadata now declares device width, initial scale, a dark theme color and \`viewport-fit=cover\` for safe-area-aware device layouts.
- Global CSS enhancements cover safe-area insets, dynamic viewport heights, compact 320px screens, small landscape devices, dialog and mobile menu scrolling, flexible grid shrink behavior, long strings, consistent focus-visible outlines and a reduced-motion baseline.
- Touch and coarse-pointer users no longer receive hover-only card movement. Common filter controls have a minimum 44px target height; the menu toggle remains a large, keyboard-accessible target.
- High-contrast and forced-colors focus/border fallbacks have been added.
- No page is hidden pending a JavaScript reveal, and animation-specific artwork from earlier parts remains intact.

## Responsive and accessibility coverage

\`tests/responsive.spec.ts\` audits 22 current public routes at ten viewport widths: 320, 360, 375, 430, 600, 768, 1024, 1280, 1440 and 1920 CSS pixels. It checks HTTP success, one main page heading, viewport metadata, document/body/main horizontal overflow, and automated WCAG 2.0/2.1 AA checks at mobile and desktop widths.

It also verifies dropdown ID wiring, route-arrival motion for ordinary preferences, absence of that motion for reduced-motion visitors, and practical tap-target sizes.

Existing tests from Parts 03–11 continue to exercise page-specific GPU scenes, form review/submission gating, reduced motion, service interactions, editorial routes and keyboard navigation.

## Touched files

- \`apps/web/src/components/layout/site-motion.tsx\`
- \`apps/web/src/components/layout/header.tsx\`
- \`apps/web/src/app/layout.tsx\`
- \`apps/web/src/app/globals.css\`
- \`tests/responsive.spec.ts\`
- \`docs/ROADMAP.md\`

## Acceptance and boundaries

Run \`npm ci && npm run verify && npm run test:browser\`. A successful static build alone is not the acceptance criterion; the full browser suite and responsive matrix must complete.

Part 12 (Admin Dashboard) remains a separate, not-yet-implemented part. Part 14 must still address the dependency audit, deployment security, database readiness/migrations, verified privacy and business records, production environment variables, headers, SEO and launch rehearsal. Part 11's real Neon migration and Resend smoke tests still require the organization's own credentials. Do not enable live collection just to make the user interface look complete.


## Verified CI result

The full GitHub Actions workflow passed on implementation commit \`ea640e15d8415392c30fcafc45637643e25e84ff\`: npm installation, Prisma Client generation, lint, TypeScript, unit tests, production build and **94/94 browser tests**. The route-wide suite reported no horizontal overflow across the tested viewport matrix and passed its WCAG 2.0/2.1 AA automated checks. Final design-system heading and 1280px header overflow fixes are included in this verified commit.

Security note: the dependency audit still reports 14 vulnerabilities, including 2 critical. Part 14 must review and remediate them; passing UI tests is not a production security signoff.
