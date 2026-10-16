import { describe, expect, it } from "vitest";
import { createSphereGeometry, orbitAt } from "./globe-model";

describe("Part 04 orbiting Earth", () => {
  it("generates correctly bounded sphere positions and full UV texture coordinates", () => {
    const longitude = 16, latitude = 8;
    const geometry = createSphereGeometry(longitude, latitude);
    expect(geometry.length).toBe(longitude * latitude * 6 * 5);
    expect([...geometry].every(Number.isFinite)).toBe(true);
    for (let index = 0; index < geometry.length; index += 5) {
      const radius = Math.hypot(geometry[index]!, geometry[index + 1]!, geometry[index + 2]!);
      expect(radius).toBeCloseTo(1, 5);
      expect(geometry[index + 3]).toBeGreaterThanOrEqual(0);
      expect(geometry[index + 3]).toBeLessThanOrEqual(1);
      expect(geometry[index + 4]).toBeGreaterThanOrEqual(0);
      expect(geometry[index + 4]).toBeLessThanOrEqual(1);
    }
  });
  it("computes independent orbits that move in front of and behind the globe", () => {
    const zero = orbitAt(0, 0);
    expect(orbitAt(0, 0)).toEqual(zero);
    expect(orbitAt(0, 10)).not.toEqual(zero);
    expect(orbitAt(0, 10).depth).toBeGreaterThan(0);
    expect(orbitAt(0, 20).depth).toBeLessThan(0);
    expect(orbitAt(1, 4)).not.toEqual(orbitAt(2, 4));
    for (let index = 0; index < 6; index++) {
      const p = orbitAt(index, 12.3);
      expect(Object.values(p).every(Number.isFinite)).toBe(true);
      expect(p.scale).toBeGreaterThan(0.7);
    }
  });
  it("refuses out-of-range geometry and platform indices", () => {
    expect(() => createSphereGeometry(7, 8)).toThrow();
    expect(() => createSphereGeometry(16, 3)).toThrow();
    expect(() => orbitAt(-1, 0)).toThrow();
    expect(() => orbitAt(6, 0)).toThrow();
  });
});
