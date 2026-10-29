import type { MountainPhase } from "./scene-contracts";

export const IMPACT_TIMES = [2.25, 2.57, 2.89] as const;
export const FORMATION_SECONDS = 1.8;
export const HERO_SEQUENCE_SECONDS = 5;
export const EXPLOSION_START = 3.21;
export const REVEAL_START = 3.91;

export function mountainPhaseAt(seconds: number): MountainPhase {
  if (seconds < FORMATION_SECONDS) return "forming";
  if (seconds < IMPACT_TIMES[0]) return "formed";
  if (seconds < IMPACT_TIMES[1]) return "impact-one";
  if (seconds < IMPACT_TIMES[2]) return "impact-two";
  if (seconds < EXPLOSION_START) return "impact-three";
  if (seconds < REVEAL_START) return "exploding";
  return "revealed";
}

export function mountainHeight(x: number, depth: number): number {
  const primary = 1.93 * Math.exp(-0.64 * x * x);
  const left = 0.53 * Math.exp(-2.6 * (x + 1.55) ** 2);
  const right = 0.39 * Math.exp(-3.8 * (x - 1.66) ** 2);
  const depthFalloff = Math.max(0.05, 1 - Math.abs(depth) / 1.75);
  const erosion = 0.094 * Math.sin(x * 10.4 + depth * 4.7) +
    0.058 * Math.sin(x * 18.1 - depth * 10.8) +
    0.031 * Math.cos(x * 35.2 + depth * 14);
  return -1.08 + (primary + left + right) * (0.27 + depthFalloff * 0.75)
    - Math.abs(depth) * 0.12 + erosion * depthFalloff;
}

/** Deterministic positions: [origin.xyz, mountain.xyz, size, random] per vertex. */
export function makeMountainParticles(columns: number, rows: number, seed = 1729) {
  if (!Number.isInteger(columns) || !Number.isInteger(rows) || columns < 2 || rows < 2)
    throw new Error("Invalid mountain particle dimensions");
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const data = new Float32Array(columns * rows * 8);
  for (let z = 0; z < rows; z++) {
    for (let x = 0; x < columns; x++) {
      const index = (z * columns + x) * 8;
      const worldX = -3.12 + 6.24 * ((x + (random() - 0.5) * 0.68) / (columns - 1));
      const worldZ = -1.7 + 3.4 * ((z + (random() - 0.5) * 0.65) / (rows - 1));
      const targetY = mountainHeight(worldX, worldZ);
      const angle = random() * 6.2831853;
      const distance = 2.5 + random() * 3.6;
      data[index] = Math.cos(angle) * distance;
      data[index + 1] = (random() - 0.5) * 4.4;
      data[index + 2] = Math.sin(angle) * distance * 0.7;
      data[index + 3] = worldX;
      data[index + 4] = targetY;
      data[index + 5] = worldZ;
      data[index + 6] = 1.0 + random() * 2.0;
      data[index + 7] = random();
    }
  }
  return data;
}
