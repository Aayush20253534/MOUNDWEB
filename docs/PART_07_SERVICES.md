# Part 07 — Digital Marketing Services and Advertising Coming Soon

## Delivered

The Services page retains six existing marketing-only categories: SEO, Social Media Marketing, Performance Marketing, Content & Creative, Brand Identity & Growth, and Growth Strategy & Consulting. No Website Development client service has been introduced; Web Development stays exclusively under training programs.

- Six dynamically routed but statically generated service detail pages with verified local navigation and descriptive metadata.
- Per-service positioning, possible project activities, a conceptual three-step approach, meaningful measurement indicators, FAQs, and subject-prefilled marketing inquiry links.
- A client-side goal explorer connects six concrete brand priorities with related services. It is informational, not a claim of custom consulting or a guaranteed recommendation.
- Existing six service image assets remain in place. Each full-size service card links to its detail page.
- A clickable Advertising Coming Soon teaser opens a distinct cinematic page at /services/advertising-coming-soon.
- The Advertising page explains that the separate offering is unavailable to book and does not imply a launch date. Existing paid-campaign strategy belongs to Performance Marketing.
- Original brand-growth hero artwork replaces the mountain photograph. A central brand tile connects SEO, social media, performance marketing, content and creative, brand identity, and growth strategy. Search results, a social post, signal paths and a conceptual campaign chart animate in sequence; no chart displays real client metrics.
- Pause/resume controls, automatic pause outside the viewport or in a hidden tab, and a complete static illustration for reduced-motion visitors. Hero links open the existing project inquiry, service collection and process section. No animation or image dependencies were added.
- Subtle section entrances, hover treatments and Advertising Coming Soon decorative rings retain reduced-motion fallbacks.
- No false statistics, prices, rankings, results, unverified customer testimonials, or fake registration forms.

## Implementation

- apps/web/src/lib/service-guides.ts and service-guides.test.ts
- apps/web/src/components/services/service-explorer.tsx
- apps/web/src/components/services/service-motion.tsx
- apps/web/src/components/services/services-hero.tsx
- apps/web/src/components/services/growth-studio.tsx
- apps/web/src/components/services/services-hero.module.css
- apps/web/src/app/services/page.tsx
- apps/web/src/app/services/[slug]/page.tsx
- apps/web/src/app/services/advertising-coming-soon/page.tsx
- apps/web/src/components/ui/cards.tsx
- apps/web/src/app/globals.css
- tests/browser.spec.ts

## Verification and remaining work

Run npm ci, npm run verify, and npm run test:browser. Automated browser checks include six cards, click-through routes, interactive recommendations, detail page process/FAQ, Coming Soon navigation and reduced motion. Full responsive accessibility tests cover five viewport widths for the Services index.

Business review is required for actual engagements, final scope of work, package pricing, legal/marketing copy and any service promises. The Contact form remains a local review-only preview. Sending inquiries and emails must wait for the validated Express + Neon + Resend backend in Part 11.

The Part 14 security audit must address dependency vulnerabilities identified by npm before production deployment.
