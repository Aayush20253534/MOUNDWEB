import { describe, expect, it } from "vitest";
import { careerDepartments, isOpenRole, jobListings, type Role } from "./careers";

const example: Role = {
  slug: "test-role",
  title: "Example role", department: "Learning & Education",
  employmentType: "Full time", arrangement: "On-site",
  location: "Prayagraj", description: "Illustrative test vacancy, not public content.",
  responsibilities: ["Teaching practice"], requirements: ["Communication skills"],
  status: "published", approvedAt: "2026-10-16",
  applicationUrl: "https://example.org/apply",
};

describe("Part 10 career publication", () => {
  it("has no made-up openings in the public vacancy list", () => {
    expect(jobListings).toHaveLength(0);
    expect(careerDepartments).toHaveLength(4);
    expect(careerDepartments.every((dept) => dept.focus.length > 0)).toBe(true);
  });
  it("requires approved posting and a real secure application route", () => {
    expect(isOpenRole(example)).toBe(true);
    expect(isOpenRole({ ...example, status: "draft" })).toBe(false);
    expect(isOpenRole({ ...example, status: "closed" })).toBe(false);
    expect(isOpenRole({ ...example, approvedAt: undefined })).toBe(false);
    expect(isOpenRole({ ...example, applicationUrl: undefined })).toBe(false);
    expect(isOpenRole({ ...example, applicationUrl: "javascript:alert(1)" })).toBe(false);
    expect(isOpenRole({ ...example, requirements: [] })).toBe(false);
    expect(isOpenRole({ ...example, location: "" })).toBe(false);
  });
});
