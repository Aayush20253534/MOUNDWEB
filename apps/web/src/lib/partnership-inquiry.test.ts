import { describe, expect, it } from "vitest";
import {
  formatPartnershipDraft,
  partnershipOptions,
  validatePartnershipDraft,
  type PartnershipDraft,
} from "./partnership-inquiry";

const college: PartnershipDraft = {
  kind: "colleges",
  name: "Academic Coordinator",
  email: "coordinator@example.edu",
  phone: "+91 9876543210",
  organization: "Example Polytechnic",
  role: "Program Coordinator",
  location: "Prayagraj",
  interest: "workshops",
  message: "We want to explore a supervised digital skills workshop for our learners.",
  acknowledged: true,
};

describe("Part 08 partnership inquiry drafts", () => {
  it("accepts complete international contact data but does not require phone", () => {
    expect(validatePartnershipDraft(college)).toEqual({});
    expect(validatePartnershipDraft({ ...college, phone: "" })).toEqual({});
    expect(validatePartnershipDraft({ ...college, phone: "+977 9812345678" })).toEqual({});
  });
  it("validates organization, role, region and message with clear errors", () => {
    expect(validatePartnershipDraft({
      ...college, organization: " ", role: " ", location: " ",
      message: "short", email: "invalid", phone: "letters",
    })).toMatchObject({
      organization: expect.any(String),
      role: expect.any(String),
      location: expect.any(String),
      message: expect.any(String),
      email: expect.any(String),
      phone: expect.any(String),
    });
  });
  it("requires acknowledgement and a kind-appropriate interest", () => {
    expect(validatePartnershipDraft({ ...college, acknowledged: false })).toHaveProperty("acknowledged");
    const franchise = { ...college, kind: "franchise" as const };
    expect(validatePartnershipDraft(franchise)).toHaveProperty("interest");
    expect(validatePartnershipDraft({ ...franchise, interest: "market" })).toEqual({});
    expect(partnershipOptions.franchise.map((item) => item.value)).not.toContain("workshops");
  });
  it("formats drafts without implying submission or approval", () => {
    const draft = formatPartnershipDraft(college);
    expect(draft).toContain("Not submitted");
    expect(draft).toContain("Example Polytechnic");
    expect(draft).toContain("Workshops and training sessions");
    expect(draft).toContain(college.message);
    expect(draft).not.toMatch(/approved|accepted|submitted successfully/i);
  });
});
