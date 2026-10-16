import { describe, expect, it } from "vitest";
import { courses } from "./content";
import { courseGuides, getGuide } from "./course-guides";

describe("Part 06 course guidance", () => {
  it("has a unique complete draft guide for each approved course", () => {
    expect(Object.keys(courseGuides).sort()).toEqual(courses.map((course) => course.slug).sort());
    for (const course of courses) {
      const guide = getGuide(course);
      expect(guide.slug).toBe(course.slug);
      expect(guide.modules.length).toBeGreaterThanOrEqual(3);
      expect(guide.outcomes.length).toBeGreaterThanOrEqual(3);
      expect(guide.modules.every((module) => module.topics.length > 0)).toBe(true);
      expect(guide.audience).toBeTruthy();
      expect(guide.sampleProject).toBeTruthy();
    }
  });
  it("keeps children’s course with parent/guardian guidance", () => {
    const guide = courseGuides["ai-digital-ninja"]!;
    expect(guide.level).toBe("Young learners");
    expect(guide.prerequisites).toMatch(/guardian consent/);
    expect(courses.find((course) => course.slug === guide.slug)?.category).toBe("Digital Marketing");
  });
  it("does not assert unapproved fees, start dates, or employment guarantees", () => {
    const descriptions = JSON.stringify(courseGuides);
    expect(descriptions).not.toMatch(/₹\s*\d|guaranteed job|100% placement|starts on \d/i);
    expect(courses.filter((course) => course.category === "Web Development").every((course) => !course.duration)).toBe(true);
  });
});
