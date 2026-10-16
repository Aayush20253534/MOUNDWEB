# Part 03: Particle mountain

Implemented: a procedural mountain rendered as GPU point sprites, with three projectiles, expanding impact shockwaves, temporary particle dispersion, and DOM brand reveal.

## Architecture

- mountain-model.ts: deterministic mountain heightfield, particle origins/targets, storyboard timing. No runtime dependency.
- mountain-webgl.ts: WebGL2 vertex/fragment shaders, static mountain and dynamic projectile/shock-ring buffers, adaptive device pixel ratio.
- mountain-runtime.tsx: browser-only dynamic import, viewport/visibility control, reduced-motion and Save-Data fallbacks.
- scene-stages.tsx: preserves the original Next.js image poster, shade and semantic hero copy. Only mounts a client scene inside the mountain stage.

Animation: formation 0–1.8 seconds, formation hold, projectile hits at 2.25/2.57/2.89 seconds, explosion 3.21–3.91 seconds, then wordmark glow.

The animation does not play sound or block the CTA. The MOUNDWEB heading is real accessible text. No video or paid 3D generator is required.

## Performance and failures

The GPU scene is dynamically loaded when the stage is near viewport; otherwise the poster stands alone. Low-end devices render 76 x 49 particles; larger devices use 152 x 94. RequestAnimationFrame stops offscreen or in background tabs. Canvas allocation and GPU objects are cleaned up on unmount. On WebGL2 failure, context loss, reduced motion, or Save-Data, the poster remains available.

Visual tuning and profiling on real Android and iOS devices is a final acceptance gate. Rendering quality can vary with GPU/browser drivers.

## Test checklist

Run npm ci, npm run verify, and npm run test:browser. Unit tests validate deterministic geometry, phases and the three impact milestones. Manual testing should watch the full hero timeline at 375/768/1024/1440/1920 pixel widths, test context loss, scrolling, motion preferences, resize, and repeat navigation.

Part 04 will implement the revolving Earth with independent orbital marketing icons; its existing static stage is deliberately unchanged.
