/** Dimensionless orbit trajectories for DOM platforms. No per-frame React updates. */
export type OrbitPoint = { x: number; y: number; depth: number; scale: number };
const TILTS = [-0.45, 0.36, -0.8, 0.64, -0.22, 0.91] as const;
const SPEEDS = [0.21, -0.18, 0.23, -0.2, 0.17, -0.22] as const;

/** Motion is in radians/second; negative depth places an icon behind Earth. */
export function orbitAt(index: number, seconds: number): OrbitPoint {
  if (!Number.isInteger(index) || index < 0 || index >= TILTS.length) {
    throw new RangeError("Invalid orbit index");
  }
  const phase = index * (Math.PI * 2 / 6) + seconds * SPEEDS[index]!;
  const tilt = TILTS[index]!;
  const projectedDepth = Math.sin(phase);
  const lane = 0.82 + (index % 3) * 0.1;
  const c = Math.cos(phase);
  const s = Math.sin(phase) * 0.34;
  return {
    x: lane * (c * Math.cos(tilt) - s * Math.sin(tilt)),
    y: lane * (c * Math.sin(tilt) + s * Math.cos(tilt)),
    depth: projectedDepth,
    scale: 0.76 + 0.25 * (projectedDepth + 1) / 2,
  };
}

/** Orthographic sprite geometry: position.xyz + equirectangular UV. */
export function createSphereGeometry(longitudes = 96, latitudes = 56): Float32Array {
  if (!Number.isInteger(longitudes) || !Number.isInteger(latitudes) ||
      longitudes < 8 || latitudes < 4 || longitudes > 512 || latitudes > 256) {
    throw new RangeError("Invalid globe tessellation");
  }
  const output = new Float32Array(longitudes * latitudes * 6 * 5);
  const vertex = (slot: number, row: number, col: number) => {
    const theta = Math.PI * row / latitudes;
    const phi = Math.PI * 2 * col / longitudes - Math.PI;
    const sinTheta = Math.sin(theta);
    const index = slot * 5;
    output[index] = sinTheta * Math.sin(phi);
    output[index + 1] = Math.cos(theta);
    output[index + 2] = sinTheta * Math.cos(phi);
    output[index + 3] = col / longitudes;
    output[index + 4] = 1 - row / latitudes;
  };
  let slot = 0;
  for (let row = 0; row < latitudes; row++) {
    for (let col = 0; col < longitudes; col++) {
      vertex(slot++, row, col);
      vertex(slot++, row + 1, col);
      vertex(slot++, row, col + 1);
      vertex(slot++, row, col + 1);
      vertex(slot++, row + 1, col);
      vertex(slot++, row + 1, col + 1);
    }
  }
  return output;
}
