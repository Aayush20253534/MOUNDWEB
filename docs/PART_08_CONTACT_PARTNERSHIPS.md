# Part 08 — Contact and Partnerships

## Scope delivered

Contact and partnership frontend flows have been implemented in the existing Next.js application without modifying unrelated project pages, the Part 03 mountain, or the Part 04 globe.

### Contact

- The Contact hero uses original HTML/CSS inquiry artwork in the dark-orange visual style: a draft letter rises from an open envelope while idea bubbles, a paper plane and connections to the four inquiry pathways animate around it. It replaces the old mountain hero, without presenting a live chat, delivery confirmation or availability claim.
- Pause/resume controls, automatic pause offscreen or in a hidden tab, and a complete static scene for reduced-motion preferences. The hero links to the existing inquiry form and conversation-path chooser. No new dependencies, image requests or message submissions are introduced.
- Preserves the responsive inquiry form, information cards, confirmed social links, FAQ and supporting network imagery.
- Adds four route selectors: brand growth, programs, colleges and franchises. College and franchise selections navigate to their purpose-built inquiry sections instead of a generic contact dropdown.
- Existing Contact inquiry validates name, email, optional international phone, inquiry type, subject and message. A valid draft opens a modal review, with a copy-to-clipboard action and an accessible status message.
- Messages and prefilled course/service context from earlier parts remain intact. The Contact form still makes no HTTP submission or local persistence.

### Partnerships

- College and franchise landing pages preserve approved conceptual imagery and previously documented limitations.
- Dedicated validated forms request contact person, email, optional phone, organization or college name, role, location, type-specific interest and collaboration message.
- An explicit acknowledgement is required to review a draft: **this is not a submission, signed agreement, reservation, exclusive territory, or offer**.
- The review modal contains the entered data and a working user-triggered copy-to-clipboard action. Browser clipboard restrictions are reported without misleading success claims.
- Animated three-stage illustrative process: share an idea, explore fit, confirm terms after due diligence; separate college and franchise FAQs avoid guarantees.
- Revised layouts and lightweight decorative motion for contact cards and partnership sections. No content is hidden without JS. Reduced-motion preferences are respected.

## Technical handoff for Part 11

Files added:
- `apps/web/src/lib/partnership-inquiry.ts` and corresponding unit test
- `apps/web/src/components/forms/partnership-form.tsx`
- `apps/web/src/components/forms/copy-draft.tsx`
- `apps/web/src/components/partners/partnership-process.tsx`
- `apps/web/src/components/scenes/connection-motion.tsx`

Files updated: Contact, Partners, individual partnership pages, existing inquiry form and validation utilities, styling, browser tests and roadmap.

Before enabling real submissions, create a well-defined, server-side Zod/Express contract for the two partnership kinds and the existing `Inquiry` type; do not trust client-side validation. Require approved data-processing notices, record opt-in where applicable, and implement rate-limiting, anti-spam measures, audit logs, Neon persistence and Resend notifications. Server-derived submission statuses must replace the review-only copy. Admin review, retention policy, deletion handling and recipient emails need real business decisions. Do not send messages based only on a query parameter.

No identity documents, sensitive student records, confidential partner contracts or CV uploads are collected in these frontend preview forms.

## Verification

Run `npm ci && npm run verify && npm run test:browser`. Unit tests cover validation, kind-dependent interests, invalid data, acknowledgement, text copy formatting. Browser checks cover route selection, invalid and valid college/franchise drafts, preview-only behavior (zero POST requests), copy feedback, reduced motion, mobile overflow and WCAG 2/2.1 AA automated audits for partnership pages.

Business approval needed before launch: actual email/phone/address/hours, availability, course/partnership scope, institution safeguarding, franchising terms and supporting legal/privacy policies. Reported npm dependency vulnerabilities require triage in Part 14.
