# MOUNDWEB design system — Parts 01–02

The supplied Home, About, Programs, Services, Contact, and wide homepage hero images are the visual authority. This implementation preserves the cinematic black/orange composition, mountain imagery, compact navigation, thin amber borders, restrained bloom, dense service/course grids, split sections, and landscape CTAs. It corrects unsupported claims and the course/service hierarchy.

## Architecture

- `apps/web`: existing Next.js 15 App Router, React 19, strict TypeScript.
- `apps/api`: existing Express/Node/TypeScript API. Business integrations remain deferred.
- `packages/shared`: existing shared contracts.
- `src/lib/content.ts`: typed navigation, six active marketing services, eleven courses, and FAQs.
- `src/lib/inquiry.ts`: local inquiry validation. It is not a backend schema or delivery service.
- Pages and visual components render on the server. Only navigation, dialogs, and the inquiry form require client JavaScript.
- Tailwind 4 is configured through `@tailwindcss/postcss`. Component CSS is organized in `@layer components`; tokens are shared with Tailwind using `@theme inline`.
- `/design-system` is a noindex component gallery. No production business examples are fabricated there.

## Tokens

| Token              | Value                       | Use                                    |
| ------------------ | --------------------------- | -------------------------------------- |
| `--background`     | `#070707`                   | Page canvas                            |
| `--surface`        | `#11100F`                   | Panels and cards                       |
| `--surface-raised` | `#181513`                   | Hover and nested surfaces              |
| `--text`           | `#F5F5F5`                   | Primary text                           |
| `--muted`          | `#B4B0AD`                   | Body copy                              |
| `--subtle`         | `#96918D`                   | Supporting text                        |
| `--accent`         | `#FF813E`                   | Accessible orange labels, icons, links |
| `--accent-strong`  | `#FF5C25`                   | Large emphasized text and filled CTAs  |
| `--accent-soft`    | `#FFB273`                   | Focus ring and warm highlights         |
| `--border`         | `#2C2521`                   | Neutral borders                        |
| `--accent-border`  | `#A95226`                   | Orange borders                         |
| `--radius`         | `12px`                      | Main cards and panels                  |
| `--radius-small`   | `7px`                       | Compact panels                         |
| `--duration`       | `220ms`                     | Hover transitions                      |
| `--ease-out`       | `cubic-bezier(.22,1,.36,1)` | Small transitions                      |

Orange illumination remains local to the mountain artwork, controls, scene posters, and selected card borders. Body sections use near-black surfaces instead of full-page gradients.

## Brand and typography

`Brand` renders one geometric mountain mark with the MOUNDWEB wordmark; WEB is orange. Header and footer share the same component. `compact` is available for icon-only placements. Public assets include the mark, wordmark variants, SVG/ICO favicon, Apple touch icon, and 192/512px application icons.

Manrope variable is used for headings and brand text; Inter variable is used for body/UI text. Latin WOFF2 subsets are bundled locally and loaded with `next/font/local`. Both SIL Open Font License texts are committed in `docs/licenses/`. No Google Fonts request occurs at runtime.

| Element       | Desktop                     | Mobile                          |
| ------------- | --------------------------- | ------------------------------- |
| Home wordmark | up to 146px; 160px at 1800+ | 13.1vw                          |
| Page H1       | 42–68px                     | 36–52px                         |
| Section H2    | 29–42px                     | 30px                            |
| Card heading  | 14–20px                     | 13–20px                         |
| Body          | 15px                        | 13–15px                         |
| Eyebrow       | 10px, tracked uppercase     | 9px                             |
| Form control  | 12px                        | 16px to avoid mobile input zoom |

## Layout

The container is 1280px maximum, rising to 1440px on very wide displays. Gutters step from 48px to 32px, 24px, and 20px. Section spacing is 52–88px. Breakpoints at 1230, 1100, 800, and 600px handle content density rather than arbitrary device names.

- Desktop navigation becomes a focus-managed drawer at 1100px.
- Service grid: 3 / 2 / 1 columns.
- Course grid: 3 / 2 / 1 columns. All six Digital Marketing courses, including Kids, are present. All five proposed Web Development courses are present.
- Programs have exactly two top-level paths. AI marketing is nested under Digital Marketing.
- Split sections collapse to one column; the globe remains alongside copy on tablets where space permits.
- Contact form: two fields per row on larger screens, one per row on phones. The decorative right panel is removed below 1230px.
- Inner-page mountain artwork occupies the right side on desktop to keep the summit visible and the heading readable. On phones it becomes the lower hero landscape.

## Reusable components

| File                                         | Components / responsibilities                                                                                                                                                                 |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/layout/brand.tsx`                | `Brand`, `MountainMark`                                                                                                                                                                       |
| `components/layout/header.tsx`               | Active navigation, grouped Explore/Partner links, keyboard dropdowns, mobile drawer                                                                                                           |
| `components/layout/footer.tsx`               | Real internal links, brand signature, contact CTA                                                                                                                                             |
| `components/ui/primitives.tsx`               | `Button`, `ButtonLink`, `Container`, `Section`, `SectionHeading`, `Eyebrow`, `Badge`, `IconTile`, `FeaturePanel`, `Grid`, `Field`, `Skeleton`, `EmptyState`, `Divider`, `Glow`, `Breadcrumbs` |
| `components/ui/cards.tsx`                    | `ServiceCard`, `CourseCard`, `StatCard`, `TestimonialCard`                                                                                                                                    |
| `components/ui/icon.tsx`                     | Typed Lucide icon mapping                                                                                                                                                                     |
| `components/ui/accordion.tsx`                | Native keyboard-accessible FAQ disclosures                                                                                                                                                    |
| `components/ui/dialog.tsx`                   | Radix dialog with focus trap, Escape and focus restoration                                                                                                                                    |
| `components/forms/inquiry-form.tsx`          | Validation, local review dialog, query-string preselection; no network submission                                                                                                             |
| `components/sections/page-hero.tsx`          | Reusable split hero with image, copy, actions, optional scene labels                                                                                                                          |
| `components/sections/shared.tsx`             | CTA, capability strip, measurement framework, process, partnership panels                                                                                                                     |
| `components/sections/editorial-template.tsx` | Podcast/media/career/record page shell with honest empty states                                                                                                                               |
| `components/scenes/*`                        | Static posters and typed future animation boundaries                                                                                                                                          |

`TestimonialCard` defaults to an explicit design-sample label. Do not pass `verified=true` without an approved quote, attribution, and publication consent. `StatCard` displays pending values for unverified records; never turn these into invented counters.

## Navigation and templates

All requested destinations resolve: Home, About, Our Programs, Our Services, Podcast, Media, Career, Training & Placements, Partner With Us, Contact, College Partnerships, Franchise Partnerships, and eleven individual course details. Privacy/terms are clearly marked publication-pending pages, not invented legal policies.

## Interaction and accessibility

- Semantic header/navigation/main/footer and one page H1.
- Skip-to-content link; visible orange focus outlines.
- Normal link semantics for navigation and buttons for actions.
- Desktop disclosure buttons expose expanded state, close on Escape/outside focus, and restore focus.
- Mobile drawer traps focus, locks background scroll, and restores focus on close.
- FAQs use native `details`/`summary`.
- Form labels, required indicators, field-level errors, error summary, and focus on the first invalid field.
- Form review renders text through React, never as HTML. No form data is sent or persisted.
- Reduced-motion disables transitions/loading shimmer. Content is never hidden pending animation.
- `next/image` supplies explicit dimensions or reserved aspect ratios, responsive sizes, and lazy loading. Hero backgrounds are prioritized.

## Editorial constraints

No client logos, testimonials, phone numbers, addresses, placement statistics, or commercial promises have been invented. Capability labels replace the unverified partner strip. Qualitative measurement cards replace unsupported performance metrics. Role illustrations replace fictional employee photographs. Newsletter signup is replaced by a contact CTA until delivery exists.

Web Development is a course offering only. Advertising is visibly Coming Soon. Proposed course topics, all prices, Web Development durations, delivery details, and outcomes remain marked as unconfirmed.

## Dependencies and references

See the lockfile for exact resolved versions. The implementation remains on Next.js 15 rather than replacing the project architecture.

- [Tailwind Next.js setup](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [Next.js local fonts](https://nextjs.org/docs/15/app/api-reference/components/font)
- [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
