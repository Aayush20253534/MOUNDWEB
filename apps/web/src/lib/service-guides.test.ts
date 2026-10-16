import { describe, expect, it } from "vitest";
import { services } from "./content";
import { getServiceGuide, serviceGoals, serviceGuides } from "./service-guides";

describe("Part 07 marketing services", () => {
  it("documents each of the six marketing services without inventing new ones", () => {
    expect(services).toHaveLength(6);
    expect(Object.keys(serviceGuides).sort()).toEqual(services.map((item) => item.slug).sort());
    for (const service of services) {
      const guide = getServiceGuide(service);
      expect(guide.slug).toBe(service.slug);
      expect(guide.activities.length).toBeGreaterThanOrEqual(4);
      expect(guide.steps).toHaveLength(3);
      expect(guide.signals.length).toBeGreaterThanOrEqual(3);
      expect(guide.faqs.length).toBeGreaterThanOrEqual(2);
      expect(guide.positioning).toBeTruthy();
      expect(guide.clientQuestion).toBeTruthy();
    }
  });
  it("maps each explorer choice to an actual marketing service", () => {
    expect(serviceGoals).toHaveLength(6);
    expect(new Set(serviceGoals.map((item) => item.slug)).size).toBe(6);
    for (const goal of serviceGoals) expect(services.some((item) => item.slug === goal.slug)).toBe(true);
  });
  it("keeps web development strictly in education and performance distinct from upcoming advertising", () => {
    expect(services.map((item) => item.title).join(" ")).not.toMatch(/web.*development/i);
    expect(getServiceGuide(services.find((item) => item.slug === "brand-identity")!).faqs)
      .toEqual(expect.arrayContaining([expect.objectContaining({ answer: expect.stringContaining("education") })]));
    expect(getServiceGuide(services.find((item) => item.slug === "performance-marketing")!).faqs)
      .toEqual(expect.arrayContaining([expect.objectContaining({ answer: expect.stringContaining("future expansion") })]));
  });
  it("avoids fabricated percentage returns and placement claims", () => {
    const published = JSON.stringify(serviceGuides);
    expect(published).not.toMatch(/100%\s*(growth|results|placements)|guaranteed return|\d+x\s*ROAS/i);
  });
});
