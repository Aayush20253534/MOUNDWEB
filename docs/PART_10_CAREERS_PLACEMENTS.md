# Part 10 — Careers & Training/Placements

## Delivered
- Replaces the generic Careers placeholder with a designed, responsive MOUNDWEB page featuring a cinematic orange orbital illustration, animated decorative elements, proposed values, recruitment-process guidance and clear privacy messaging.
- Four searchable and filterable **areas of interest**: Marketing & Growth, Creative & Content, Learning & Education, and Operations. These are **not** vacancies and carry no salary, application deadline or job offer.
- `jobListings` is empty until business-verified openings arrive. `isOpenRole` checks published status, approval, https application channel, description, location, requirements and responsibilities. This is a rendering gate, **not** security authorization.
- The Careers Contact CTA prepares only a general question in the existing local preview. **No CV uploads or real job applications** are accepted.
- Replaces the generic Training/Placements placeholder with a designed learning-and-outcome site, linking only Digital Marketing and Web Development courses, an illustrative learning journey, and an interactive verification methodology.
- `placementReports` is empty; there are **no published placement counts or percentages**. Its type distinguishes enrollment, completion, assistance and verified employment. The `isVerifiedReport` gate checks consent/privacy review, approved status, source, review date, valid reporting period and nonnegative integer figures.
- The metric definition switcher explains inclusions and exclusions. The track selector filters verified reports. When none exist, a prominent no-data state avoids substituting an invented zero metric.
- Reuses the established brand assets and scroll-motion controller; honors reduced-motion settings and accessible server-rendered HTML.

## Data still needed
- Confirmed, approved hiring positions (role, department, city, work arrangement, legal entity, obligations, requirements, official application method, deadline and contact).
- Approved training methodology and assessment criteria, reporting periods, denominators, consent, source documents, de-duplication and employment verification.
- Approved privacy and data retention policies, applicant consent and candidate support process.
- Actual records must be business-verified and audited; never infer training or placement counts from inquiry forms or examples.

## Backend handoff
Parts 11/12 must implement authenticated management of jobs and outcome reports, restricted publication transitions, audit logging, validation, deletion/retention, application capture only after privacy approval, protected records in Neon and optional Resend communications. Avoid storing student/candidate identity or outcome data in publicly served JSON or source files.

## Files
- `apps/web/src/lib/careers.ts` and `careers.test.ts`
- `apps/web/src/lib/placements.ts` and `placements.test.ts`
- `apps/web/src/components/careers/career-explorer.tsx`
- `apps/web/src/components/careers/placement-dashboard.tsx`
- `apps/web/src/app/career/page.tsx`
- `apps/web/src/app/training-placements/page.tsx`
- `apps/web/src/app/globals.css` and `tests/browser.spec.ts`

## Verify
Run `npm ci && npm run verify && npm run test:browser`.

Tests cover approved job gates, verified reporting gates, filter controls, no fake vacancies, no placement outcomes, responsive mobile/desktop WCAG AA audits, and reduced-motion behavior. Both pages are noindex until approved records, application processing and legal policies are supplied.

Security and deployment verification remain Part 14, including previously reported dependency vulnerabilities.
