/** Stable boundary for Parts 03–04. No WebGL runtime is shipped in Parts 01–02. */
export type MountainPhase =
  | "poster"
  | "forming"
  | "formed"
  | "impact-one"
  | "impact-two"
  | "impact-three"
  | "exploding"
  | "revealed";
export type SceneQuality = "static" | "low" | "high";
export type ScenePreferences = {
  reducedMotion: boolean;
  quality: SceneQuality;
  paused: boolean;
};
export const mountainTimeline = {
  formationMs: 1800,
  impactGapMs: 320,
  explosionMs: 700,
  revealMs: 600,
  impactCount: 3,
} as const;
export const sceneAssets = {
  mountainPoster: "/assets/landscapes/mountain-hero.webp",
  earthPoster: "/assets/graphics/globe-poster.svg",
  earthSurface: "/assets/textures/earth-surface.png",
  earthMask: "/assets/textures/earth-land-mask.png",
  particle: "/assets/textures/particle-soft.svg",
  flare: "/assets/textures/light-flare.svg",
  atmosphere: "/assets/textures/atmosphere.svg",
  ridgeline: "/assets/graphics/mountain-ridgeline.svg",
  explosion: "/assets/textures/explosion-ring.svg",
} as const;
