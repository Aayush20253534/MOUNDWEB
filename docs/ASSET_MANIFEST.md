# MOUNDWEB asset manifest — Part 02

50 usable visual assets are committed under `apps/web/public/assets/`: 25 original generated illustrations and 25 brand, vector, platform, and texture assets. Their combined size is **3.02 MiB** (3,171,753 bytes), before Next.js image resizing. Fonts and browser icons are listed separately below. No remote image URL is required.

The machine-readable [manifest](../apps/web/public/assets/manifest.json) records exact dimensions, file sizes, SHA-256 hashes, provenance, purpose, and generation prompt IDs. [Generation prompts](assets/generation-prompts.json) document the 25 original image-generation outputs; the actual optimized WebP files are included, not just prompts. Generated artwork is conceptual illustration, not evidence of clients, locations, employees, or business results.

## Source key

| Key           | Source and usage                                                                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Generated     | Original OpenAI built-in image generation for this project, then local WebP optimization. No stock photographs or reference image pixels are used in website artwork.                  |
| Original      | Project-authored SVG artwork in `scripts/prepare-assets.mjs`. Brand icons are rasterized from the original mark.                                                                       |
| Geography     | Natural Earth public-domain land geometry via `world-atlas@2.0.2`, projected/styled locally with `d3-geo`. No political borders. Package license: `docs/licenses/world-atlas-ISC.txt`. |
| Simple Icons  | CC0 paths from `simple-icons@16.35.0`; see `docs/licenses/simple-icons-CC0.txt`. Marks identify illustrative marketing channels; they do not imply affiliation or client status.       |
| Channel label | Original typographic LinkedIn `in` label, not a copied official logo.                                                                                                                  |

## Website coverage

| Requirement                                    | Prepared assets and use                                                                                                                                                                  |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage mountain, atmosphere and brand growth | `landscapes/mountain-hero.webp` supplies the static hero and warm atmosphere; `summit-path.webp` and `mountain-panorama.webp` support growth and CTA compositions.                       |
| Ridgeline, particles, impacts and flares       | `graphics/mountain-ridgeline.svg`, `textures/particle-soft.svg`, `light-flare.svg`, and `explosion-ring.svg`. Reusable supporting textures; animation remains Part 03.                   |
| Globe, orbit and channels                      | Geographic `globe-poster.svg`, 2:1 Earth surface/mask PNGs, alpha atmosphere SVG, orbit paths, and six separate channel icons. Genuine sphere rendering remains Part 04.                 |
| About story, mission, vision and technology    | `about-world.webp`, `summit-path.webp`, and `mountain-panorama.webp`; reusable role graphics and UI icons carry the supporting ideas.                                                    |
| Team treatments                                | `strategists.svg`, `educators.svg`, and `creators.svg` depict roles. No generated image is represented as an employee portrait.                                                          |
| Programs                                       | Eleven distinct 3:2 illustrations plus the `programs-ascent.webp` hero. The anonymous learner is a conceptual figure, not a student or team member.                                      |
| Services                                       | Six original illustrations, one per active marketing service. The Advertising Coming Soon panel deliberately reuses the cinematic `mountain-panorama.webp` treatment with a clear badge. |
| Contact and partnerships                       | `contact-network.webp`, `college-partnership.webp`, `franchise-partnership.webp`, and `connection-network.svg`; form glows are CSS layers.                                               |

## Complete visual inventory

All paths below are relative to `apps/web/public/`. SVG dimensions describe their intrinsic viewBox/canvas, not a fixed display size. Sizes are rounded KiB; the JSON manifest is exact.

| Asset                                                                                                                 |  Dimensions |   KiB | Source        | Intended usage                                                           |
| --------------------------------------------------------------------------------------------------------------------- | ----------: | ----: | ------------- | ------------------------------------------------------------------------ |
| [`assets/brand/app-icon.svg`](../apps/web/public/assets/brand/app-icon.svg)                                           |   512 × 512 |   0.3 | Original      | Brand identity                                                           |
| [`assets/brand/icon-192.png`](../apps/web/public/assets/brand/icon-192.png)                                           |   192 × 192 |   3.8 | Original      | Brand identity                                                           |
| [`assets/brand/icon-512.png`](../apps/web/public/assets/brand/icon-512.png)                                           |   512 × 512 |  13.9 | Original      | Brand identity                                                           |
| [`assets/brand/mountain-mark.svg`](../apps/web/public/assets/brand/mountain-mark.svg)                                 |     58 × 36 |   0.2 | Original      | Brand identity                                                           |
| [`assets/brand/wordmark-dark.svg`](../apps/web/public/assets/brand/wordmark-dark.svg)                                 |    300 × 54 |   0.4 | Original      | Brand identity                                                           |
| [`assets/brand/wordmark-light.svg`](../apps/web/public/assets/brand/wordmark-light.svg)                               |    300 × 54 |   0.4 | Original      | Brand identity                                                           |
| [`assets/courses/dm-ai-master.webp`](../apps/web/public/assets/courses/dm-ai-master.webp)                             |   960 × 640 | 108.0 | Generated     | Course card and course detail artwork                                    |
| [`assets/courses/dm-ai-professional.webp`](../apps/web/public/assets/courses/dm-ai-professional.webp)                 |   960 × 640 |  71.9 | Generated     | Course card and course detail artwork                                    |
| [`assets/courses/dm-ai-special.webp`](../apps/web/public/assets/courses/dm-ai-special.webp)                           |   960 × 640 |  74.5 | Generated     | Course card and course detail artwork                                    |
| [`assets/courses/dm-digi-hero.webp`](../apps/web/public/assets/courses/dm-digi-hero.webp)                             |   960 × 640 |  60.5 | Generated     | Course card and course detail artwork                                    |
| [`assets/courses/dm-digital-ninja.webp`](../apps/web/public/assets/courses/dm-digital-ninja.webp)                     |   960 × 640 |  62.9 | Generated     | Course card and course detail artwork                                    |
| [`assets/courses/dm-foundation.webp`](../apps/web/public/assets/courses/dm-foundation.webp)                           |   960 × 640 |  73.2 | Generated     | Course card and course detail artwork                                    |
| [`assets/courses/web-advanced.webp`](../apps/web/public/assets/courses/web-advanced.webp)                             |   960 × 640 | 129.9 | Generated     | Course card and course detail artwork                                    |
| [`assets/courses/web-ai.webp`](../apps/web/public/assets/courses/web-ai.webp)                                         |   960 × 640 |  96.4 | Generated     | Course card and course detail artwork                                    |
| [`assets/courses/web-foundation.webp`](../apps/web/public/assets/courses/web-foundation.webp)                         |   960 × 640 |  58.5 | Generated     | Course card and course detail artwork                                    |
| [`assets/courses/web-frontend.webp`](../apps/web/public/assets/courses/web-frontend.webp)                             |   960 × 640 |  63.4 | Generated     | Course card and course detail artwork                                    |
| [`assets/courses/web-fullstack.webp`](../apps/web/public/assets/courses/web-fullstack.webp)                           |   960 × 640 |  60.4 | Generated     | Course card and course detail artwork                                    |
| [`assets/graphics/connection-network.svg`](../apps/web/public/assets/graphics/connection-network.svg)                 |  1600 × 550 |  17.3 | Original      | Reusable decorative graphic                                              |
| [`assets/graphics/creators.svg`](../apps/web/public/assets/graphics/creators.svg)                                     |   280 × 250 |   0.7 | Original      | Reusable decorative graphic                                              |
| [`assets/graphics/educators.svg`](../apps/web/public/assets/graphics/educators.svg)                                   |   280 × 250 |   0.6 | Original      | Reusable decorative graphic                                              |
| [`assets/graphics/globe-poster.svg`](../apps/web/public/assets/graphics/globe-poster.svg)                             |   640 × 640 |  99.9 | Geography     | Static globe fallback; projected geography, graticule, and land nodes    |
| [`assets/graphics/mountain-ridgeline.svg`](../apps/web/public/assets/graphics/mountain-ridgeline.svg)                 |  1600 × 480 |   0.6 | Original      | Reusable decorative graphic                                              |
| [`assets/graphics/orbit-paths.svg`](../apps/web/public/assets/graphics/orbit-paths.svg)                               |   640 × 640 |   0.4 | Original      | Reusable decorative graphic                                              |
| [`assets/graphics/strategists.svg`](../apps/web/public/assets/graphics/strategists.svg)                               |   280 × 250 |   0.7 | Original      | Reusable decorative graphic                                              |
| [`assets/landscapes/about-world.webp`](../apps/web/public/assets/landscapes/about-world.webp)                         | 1536 × 1024 | 218.0 | Generated     | Hero, mission, or CTA background                                         |
| [`assets/landscapes/mountain-hero.webp`](../apps/web/public/assets/landscapes/mountain-hero.webp)                     | 1536 × 1024 | 210.3 | Generated     | Hero, mission, or CTA background                                         |
| [`assets/landscapes/mountain-panorama.webp`](../apps/web/public/assets/landscapes/mountain-panorama.webp)             | 1536 × 1024 | 146.3 | Generated     | Hero, mission, or CTA background                                         |
| [`assets/landscapes/programs-ascent.webp`](../apps/web/public/assets/landscapes/programs-ascent.webp)                 | 1536 × 1024 | 168.9 | Generated     | Hero, mission, or CTA background                                         |
| [`assets/landscapes/summit-path.webp`](../apps/web/public/assets/landscapes/summit-path.webp)                         | 1536 × 1024 | 200.1 | Generated     | Hero, mission, or CTA background                                         |
| [`assets/partnerships/college-partnership.webp`](../apps/web/public/assets/partnerships/college-partnership.webp)     |   960 × 640 |  97.5 | Generated     | Conceptual partnership/contact illustration                              |
| [`assets/partnerships/contact-network.webp`](../apps/web/public/assets/partnerships/contact-network.webp)             |   960 × 640 | 102.6 | Generated     | Conceptual partnership/contact illustration                              |
| [`assets/partnerships/franchise-partnership.webp`](../apps/web/public/assets/partnerships/franchise-partnership.webp) |   960 × 640 |  84.9 | Generated     | Conceptual partnership/contact illustration                              |
| [`assets/platforms/analytics.svg`](../apps/web/public/assets/platforms/analytics.svg)                                 |     24 × 24 |   0.7 | Simple Icons  | Illustrative marketing channel icon, never a partner endorsement         |
| [`assets/platforms/google.svg`](../apps/web/public/assets/platforms/google.svg)                                       |     24 × 24 |   0.5 | Simple Icons  | Illustrative marketing channel icon, never a partner endorsement         |
| [`assets/platforms/instagram.svg`](../apps/web/public/assets/platforms/instagram.svg)                                 |     24 × 24 |   2.1 | Simple Icons  | Illustrative marketing channel icon, never a partner endorsement         |
| [`assets/platforms/linkedin.svg`](../apps/web/public/assets/platforms/linkedin.svg)                                   |     36 × 36 |   0.2 | Channel label | LinkedIn channel label; no affiliation implied                           |
| [`assets/platforms/meta.svg`](../apps/web/public/assets/platforms/meta.svg)                                           |     24 × 24 |   1.3 | Simple Icons  | Illustrative marketing channel icon, never a partner endorsement         |
| [`assets/platforms/youtube.svg`](../apps/web/public/assets/platforms/youtube.svg)                                     |     24 × 24 |   0.5 | Simple Icons  | Illustrative marketing channel icon, never a partner endorsement         |
| [`assets/services/branding.webp`](../apps/web/public/assets/services/branding.webp)                                   |   960 × 640 |  72.1 | Generated     | Service card artwork                                                     |
| [`assets/services/content-creative.webp`](../apps/web/public/assets/services/content-creative.webp)                   |   960 × 640 |  72.3 | Generated     | Service card artwork                                                     |
| [`assets/services/growth-strategy.webp`](../apps/web/public/assets/services/growth-strategy.webp)                     |   960 × 640 |  52.2 | Generated     | Service card artwork                                                     |
| [`assets/services/performance.webp`](../apps/web/public/assets/services/performance.webp)                             |   960 × 640 |  64.2 | Generated     | Service card artwork                                                     |
| [`assets/services/seo.webp`](../apps/web/public/assets/services/seo.webp)                                             |   960 × 640 |  87.3 | Generated     | Service card artwork                                                     |
| [`assets/services/social-media.webp`](../apps/web/public/assets/services/social-media.webp)                           |   960 × 640 |  65.8 | Generated     | Service card artwork                                                     |
| [`assets/textures/atmosphere.svg`](../apps/web/public/assets/textures/atmosphere.svg)                                 |   512 × 512 |   0.5 | Original      | Supporting shader/particle texture for Parts 03–04                       |
| [`assets/textures/earth-land-mask.png`](../apps/web/public/assets/textures/earth-land-mask.png)                       | 2048 × 1024 | 165.5 | Geography     | 2:1 equirectangular texture for the Part 04 sphere; no political borders |
| [`assets/textures/earth-surface.png`](../apps/web/public/assets/textures/earth-surface.png)                           | 2048 × 1024 | 283.7 | Geography     | 2:1 equirectangular texture for the Part 04 sphere; no political borders |
| [`assets/textures/explosion-ring.svg`](../apps/web/public/assets/textures/explosion-ring.svg)                         |   256 × 256 |   0.5 | Original      | Supporting shader/particle texture for Parts 03–04                       |
| [`assets/textures/light-flare.svg`](../apps/web/public/assets/textures/light-flare.svg)                               |   512 × 128 |   0.4 | Original      | Supporting shader/particle texture for Parts 03–04                       |
| [`assets/textures/particle-soft.svg`](../apps/web/public/assets/textures/particle-soft.svg)                           |   128 × 128 |   0.4 | Original      | Supporting shader/particle texture for Parts 03–04                       |

## Fonts and browser identity

| Path under `apps/web/public/`        | Specification                | Source / use                                                                                                        |
| ------------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `fonts/manrope-latin-variable.woff2` | 24,836 bytes; variable Latin | Bundled Manrope, SIL Open Font License; heading and live wordmark font. License in `docs/licenses/manrope-OFL.txt`. |
| `fonts/inter-latin-variable.woff2`   | 48,256 bytes; variable Latin | Bundled Inter, SIL Open Font License; body and controls. License in `docs/licenses/inter-OFL.txt`.                  |
| `favicon.ico`                        | 32 × 32                      | Original mountain mark.                                                                                             |
| `icon.svg`                           | 64 × 64                      | Original scalable browser icon.                                                                                     |
| `apple-touch-icon.png`               | 180 × 180                    | Original application mark.                                                                                          |
| `manifest.webmanifest`               | JSON                         | References the 192px and 512px application icons.                                                                   |

UI icons use the installed `lucide-react` package. Website brand text is live Manrope through the shared `Brand` component. Standalone wordmark SVGs are portable text-based exports with a system sans-serif fallback.

## Rendering and optimization

- WebP source images are 1536px wide for landscapes and 960px wide for card art, with quality 85. `next/image` supplies responsive output sizes, lazy loading, and AVIF/WebP negotiation.
- Explicit image dimensions, aspect-ratio containers, and fixed scene boundaries reserve space while images load.
- PNG is reserved for app/browser icons and lossless 2:1 texture maps. SVG supplies vector art and alpha sprites.
- Decorative artwork uses empty alternative text; semantic globe/channel images have descriptive text. Headings and buttons are real HTML, never baked into images.
- No GLB is needed for this phase: the future mountain is a procedural particle system and the Earth a sphere. No nonfunctional 3D placeholder is included.

## Reproduction and maintenance

Run `node scripts/prepare-assets.mjs` after `npm ci` to reproduce vector/texture assets and refresh the JSON manifest. Existing committed raster artwork is preserved when `.asset-inputs.json` is absent. To optimize newly generated images, supply that ignored local file with `id`, `input` (absolute original-image path), and `prompt` for each replacement. Generation itself is not deterministic; prompts do not guarantee identical future artwork. The committed optimized images are the canonical deliverables.

Recheck file dimensions, loading, contrast, crops, and the browser suite after replacement. Keep asset paths stable for the Part 03–04 scene contracts. Any future texture compression or renderer-specific conversion belongs with the renderer and should retain these source maps.
