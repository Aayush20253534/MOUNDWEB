import { describe, expect, it } from "vitest";
import { courses, services } from "./content";
describe("approved business content", () => {
  it("preserves both program paths and all eleven courses", () => {
    expect(
      courses.filter((c) => c.category === "Digital Marketing"),
    ).toHaveLength(6);
    expect(
      courses.filter((c) => c.category === "Web Development"),
    ).toHaveLength(5);
    expect(new Set(courses.map((c) => c.slug)).size).toBe(courses.length);
  });
  it("keeps AI marketing programs under Digital Marketing", () => {
    for (const course of courses.filter(
      (c) =>
        c.slug.startsWith("ai-") && c.slug !== "ai-assisted-web-development",
    ))
      expect(course.category).toBe("Digital Marketing");
  });
  it("does not invent unconfirmed Web Development durations", () => {
    expect(
      courses
        .filter((c) => c.category === "Web Development")
        .every((c) => !c.duration),
    ).toBe(true);
  });
  it("does not advertise website development as a service", () => {
    expect(services).toHaveLength(6);
    expect(services.map((s) => s.title).join(" ")).not.toMatch(
      /web.*development/i,
    );
  });
});
