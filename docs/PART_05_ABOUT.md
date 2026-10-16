# Part 05 — About page visual motion and brand story

## Included

- Preserves the approved MOUNDWEB black/orange About layout, existing illustration assets, mission/vision, programs/service distinctions, and partner cards.
- Animated decorative rings and orange light particles around the About hero, gently floating brand/learning/partner cards, and pointer-responsive hero artwork. The underlying text and CTA remain real accessible DOM elements.
- Section and card reveals triggered once as content enters the viewport using a lightweight IntersectionObserver with no animation framework requirement. Content remains visible and usable without JavaScript.
- New four-step conceptual approach timeline: Understand → Create → Apply → Evolve. Its connecting highlight draws as the section enters view on desktop; mobile uses a readable vertical stepper. This is a guiding framework, not an invented company chronology or dated milestones.
- Mission/vision imagery has restrained hover zoom and glow, with staggered value cards and refined team illustrations.
- Training and placement figures remain pending and unverified. No fabricated client logos, team identities, testimonials or outcomes have been introduced.

## Files

- apps/web/src/components/scenes/about-motion.tsx
- apps/web/src/components/sections/about-journey.tsx
- apps/web/src/app/about/page.tsx
- apps/web/src/app/globals.css
- tests/browser.spec.ts

## Accessibility and performance

- The About page is fully server-rendered. Motion is progressive enhancement; no opacity:0 placeholder hides content before hydration.
- Decorative visuals are aria-hidden. The framework uses a semantic ordered list, labelled by its heading, with descriptive text for each step.
- Reduced motion disables pointer effects, orbit rotation and scroll animations. No canvas/WebGL content was added to About.
- Pointer work is batched into requestAnimationFrame and event handlers and observers are disconnected when the page is unmounted.
- Responsive layouts: 4-column desktop timeline, 2-column tablet, vertically linked mobile stepper.

## Verification

Run npm ci, npm run verify and npm run test:browser. Chromium browser tests cover the About timeline, the hero parallax CSS variables, reduced-motion behavior and preserved unverified data labels; the existing responsive suite also checks five approved viewport widths, image loading and accessibility.

**Not completed:** confirmation of real company history, team profiles, training records, contact details, and any quantitative results. These are business-supplied launch requirements, not things to invent during Part 05.
