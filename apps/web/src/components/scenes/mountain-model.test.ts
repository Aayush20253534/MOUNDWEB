import { describe, expect, it } from "vitest";
import {
  EXPLOSION_START,
  HERO_SEQUENCE_SECONDS,
  IMPACT_TIMES,
  REVEAL_START,
  makeMountainParticles,
  mountainHeight,
  mountainPhaseAt,
} from "./mountain-model";

describe("Part 03 mountain storyboard", () => {
  it("runs three ordered impacts before the explosion and reveal", () => {
    expect(IMPACT_TIMES).toHaveLength(3);
    expect(IMPACT_TIMES[0]).toBeLessThan(IMPACT_TIMES[1]);
    expect(IMPACT_TIMES[1]).toBeLessThan(IMPACT_TIMES[2]);
    expect(IMPACT_TIMES[2]).toBeLessThan(EXPLOSION_START);
    expect(EXPLOSION_START).toBeLessThan(REVEAL_START);
    expect(REVEAL_START).toBeLessThan(HERO_SEQUENCE_SECONDS);
    expect(HERO_SEQUENCE_SECONDS).toBe(5);
    expect([0.2, 2.0, 2.4, 2.7, 3.0, 3.5, 4.4].map(mountainPhaseAt))
      .toEqual(["forming", "formed", "impact-one", "impact-two", "impact-three", "exploding", "revealed"]);
  });
  it("generates reproducible mountain targets and scattered origins", () => {
    const first = makeMountainParticles(16, 10);
    const second = makeMountainParticles(16, 10);
    expect(first).toEqual(second);
    expect(first.length).toBe(16 * 10 * 8);
    expect([...first].every(Number.isFinite)).toBe(true);
    expect(first[0]).not.toBe(first[3]);
    expect(mountainHeight(0, 0)).toBeGreaterThan(mountainHeight(3.1, 0));
  });
  it("rejects invalid dimensions", () => {
    expect(() => makeMountainParticles(1, 10)).toThrow();
    expect(() => makeMountainParticles(16, 0)).toThrow();
  });
});
