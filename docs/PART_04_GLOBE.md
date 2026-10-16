# Part 04 — revolving Earth and homepage motion

## Scope

- Home \`OrbitGlobeStage\` now mounts a genuine WebGL2 textured 3D sphere rather than rotating a flat PNG/SVG.
- Existing \`earth-surface.png\` and \`earth-land-mask.png\` are sampled independently. Continents and sea have separate shading; illuminated rim and slow atmospheric pulse complement the approved orange-black look.
- Globe mesh is an original equirectangular, UV-mapped sphere. It revolves continuously around its axis, with gentle pointer yaw/pitch parallax.
- The six actual platform SVG icons orbit in their own DOM layers, with independent angular velocity, plane tilt, scale, and front/back occlusion relative to the planet. Icons are illustrations of channels, **not partners or endorsements**.
- Existing SSR SVG globe remains the initial render and fallback on reduced-motion, Save-Data, unsupported WebGL2, errors, or lost GPU context.
- The separate mountain hero from Part 03 is unchanged.
- Homepage service, strategy, measurement, learning and story sections receive IntersectionObserver entry motion. Existing static fallback remains readable without JS; illustrative chart traces draw only on entry.
- Floating hero information panels drift subtly; no artificial statistics are animated.

## Implementation

- \`components/scenes/globe-model.ts\` — deterministic orbital math and sphere geometry.
- \`components/scenes/globe-webgl.ts\` — GPU shader, texture uploads, orthographic rotating sphere, icon positioning, pointer handling and cleanup.
- \`components/scenes/globe-runtime.tsx\` — lazy viewport activation, pause/resume, reduced-motion and fallback behavior.
- \`components/scenes/home-motion.tsx\` — low-overhead home-only section reveals.
- \`scene-stages.tsx\` — the public globe component retains its original props and poster.
- \`globals.css\` — planet layering, orbital paths, atmosphere, and microinteractions.
- \`tests/browser.spec.ts\` and \`globe-model.test.ts\` — automated behavior and geometry checks.

No new third-party renderer or paid video generator was introduced. Assets remain committed under \`apps/web/public/assets/\`.

## Performance and accessibility

The globe imports its shader only after it approaches the viewport. The mesh is 64×36 quads on constrained devices and 112×64 on larger devices; pixel density is capped. Rendering and orbital updates stop while offscreen or the tab is hidden. GPU programs, buffers, textures, event listeners and observers are released when unmounted or motion is disabled.

Normal navigation and text are outside the canvas and remain selectable, keyboard accessible and SEO indexable. Reduced-motion uses the static original artwork.

## Validation

Run \`npm ci && npm run verify && npm run test:browser\`. Browser smoke tests exercise a real orbit on Chromium with motion enabled and verify the static reduced-motion path. Human visual QA on desktop and midrange mobile GPUs is still recommended before launch.

## Remaining work

Part 05 is About content approval and page-specific motion. Parts 06–14 cover the remainder of course/service content, backend, admin, global motion polish, security and launch. Do not mistake animation checks for measured production-device performance.
