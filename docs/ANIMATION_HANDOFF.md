# Animation handoff — Parts 03 and 04

Parts 01–02 are the responsive layout and asset foundation. No Three.js runtime, revolving Earth, particle simulation, impact sequence, explosion animation, or video substitute is implemented.

## Stable boundaries

- `apps/web/src/components/scenes/scene-stages.tsx`
  - `ParticleMountainStage`: full hero poster, `data-scene="particle-mountain"`, `data-phase="poster"`; accepts children for a future canvas.
  - `OrbitGlobeStage`: geographically projected SVG globe, separate orbital paths, individual platform tiles; accepts children for a future canvas.
  - `Landscape`: reusable decorative image and shade layer.
- `apps/web/src/components/scenes/scene-contracts.ts`
  - `MountainPhase`, `SceneQuality`, `ScenePreferences`.
  - Proposed `mountainTimeline` values, not a running timeline.
  - `sceneAssets`: canonical local paths.
- `apps/web/src/app/page.tsx`: semantic wordmark, headline, CTA, and descriptive labels. Keep these in the DOM, outside WebGL.
- `globals.css`: reserved hero/globe dimensions, scene masks, palette, hover motion, reduced-motion rules.

## Part 03: particle mountain

Use a client-only dynamically imported canvas inside the current stage. Keep the poster as the SSR, no-JS, reduced-motion, load-error, and WebGL-unavailable fallback. Loading the scene must not delay the headline or CTA.

Sequence:

1. `poster` is visible immediately.
2. `forming`: particles resolve into calibrated mountain geometry.
3. `formed`: hold long enough to recognize the mountain.
4. Exactly three distinct impacts: `impact-one`, `impact-two`, `impact-three`.
5. `exploding`: a brief controlled particle release.
6. `revealed`: the DOM MOUNDWEB wordmark and CTA remain readable and interactive.

The current timing constants are a starting point: 1800ms formation, 320ms impact spacing, 700ms explosion, 600ms reveal. Tune in-browser against the reference rather than treating them as approved film timing. The landscape is a visual reference, not a displacement map. Part 03 must create and tune genuine geometry/particle targets; do not feed the color poster into a height field or claim it reconstructs exact 3D geometry.

Supporting assets:

| Asset                             | Use                                              |
| --------------------------------- | ------------------------------------------------ |
| `landscapes/mountain-hero.webp`   | Static fallback and camera/composition reference |
| `graphics/mountain-ridgeline.svg` | Original peak silhouette reference               |
| `textures/particle-soft.svg`      | Soft alpha particle sprite                       |
| `textures/light-flare.svg`        | Small impact/edge-light accents                  |
| `textures/explosion-ring.svg`     | Radial shock-ring supporting texture             |
| `graphics/connection-network.svg` | Background connection treatment                  |

Do not hide the page behind an intro, block navigation, add loud autoplay sound, or continually rerun the explosion on scroll. Provide a static path when motion is reduced. Pause work when offscreen or the tab is hidden; dispose GPU resources on unmount.

## Part 04: revolving Earth

Replace only the static globe stage with a genuine rotating sphere and atmosphere. Preserve the current section copy, dimensions, and layout. Orbit icons remain independent elements or sprites so they can be correctly occluded and focused if made interactive.

| Asset                          | Dimensions        | Use                                      |
| ------------------------------ | ----------------- | ---------------------------------------- |
| `textures/earth-surface.png`   | 2048 × 1024       | Styled 2:1 equirectangular surface map   |
| `textures/earth-land-mask.png` | 2048 × 1024       | White land / black ocean mask            |
| `textures/atmosphere.svg`      | 512 × 512         | Radial alpha atmosphere reference        |
| `graphics/globe-poster.svg`    | 640 × 640         | Geographically projected static fallback |
| `graphics/orbit-paths.svg`     | 640 × 640         | Orbital ellipse composition reference    |
| `platforms/*.svg`              | 24–36px viewBoxes | Separate marketing-channel icons         |

Land geometry comes from public-domain Natural Earth data via `world-atlas`. There are no political borders. Texture coordinates use conventional longitude/latitude equirectangular projection; check orientation and seam placement after importing into the chosen renderer. Color artwork is sRGB; numerical masks should not receive color-space transformation. Test SVG texture rasterization in the renderer, or derive lossless alpha PNGs from the committed SVGs at required resolution.

Platform icons are illustrative channels, not a customer/partner strip. Keep that distinction in copy and accessibility text. No external globe textures, embed, video, or iframe is required.

## Other motion

CSS hover lifts, focus states, arrow translations, and FAQ disclosure are implemented. Later parts may add restrained scroll transitions, parallax, and counters through isolated client components. Only animate confirmed numeric records. Do not animate pending dashes or turn qualitative framework graphics into claimed results.

## Suggested acceptance gates

- First content visible immediately; no intro-induced layout shift.
- Functional keyboard navigation and CTA throughout the sequence.
- Reduced-motion, no-WebGL, failed asset loading, and context-loss fallbacks.
- Profiling on an actual midrange phone, plus 375/768/1024/1440/1920 widths.
- Device-aware pixel ratio and particle budget; no unbounded loops or allocations in the render loop.
- Pause offscreen/hidden tab and clean up listeners, observers, textures, buffers, and animation frames.
- Retain `npm run verify` and `npm run test:browser`; update only the explicit static-scene assertion once Parts 03–04 are intentionally implemented.
