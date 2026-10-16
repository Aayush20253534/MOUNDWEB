import { describe, expect, it } from "vitest";
import { contactSchema, partnershipSchema } from "./submission-schemas.js";
const requestId = "123e4567-e89b-42d3-a456-426614174000";
const valid = {
  requestId, name: "Example Person", email: "someone@example.com",
  phone: "", message: "We would like to discuss a marketing campaign.",
  consent: true, noticeVersion: "2026-10-reviewed",
};
describe("Part 11 strict server-side schemas", () => {
  it("accepts valid contact and college/franchise inquiries", () => {
    expect(contactSchema.safeParse({ ...valid, type: "growth", subject: "Strategy inquiry" }).success).toBe(true);
    expect(partnershipSchema.safeParse({
      ...valid, kind: "colleges", organization: "Sample College",
      role: "Coordinator", location: "Prayagraj", interest: "workshops",
    }).success).toBe(true);
  });
  it("refuses missing privacy consent, mass assignment and invalid message", () => {
    expect(contactSchema.safeParse({
      ...valid, type: "growth", subject: "Strategy", consent: false,
    }).success).toBe(false);
    expect(contactSchema.safeParse({
      ...valid, type: "growth", subject: "Strategy", admin: true,
    }).success).toBe(false);
    expect(contactSchema.safeParse({
      ...valid, type: "growth", subject: "Strategy", message: "short",
    }).success).toBe(false);
    expect(contactSchema.safeParse({
      ...valid, type: "growth", subject: "Strategy", website: "spam",
    }).success).toBe(false);
  });
  it("requires kind-specific partnership choices and safe phone numbers", () => {
    const partnership = {
      ...valid, kind: "franchise", organization: "Sample Business",
      role: "Owner", location: "Lucknow", interest: "workshops",
    };
    expect(partnershipSchema.safeParse(partnership).success).toBe(false);
    expect(partnershipSchema.safeParse({ ...partnership, interest: "market", phone: "+977 9812345678" }).success).toBe(true);
    expect(partnershipSchema.safeParse({ ...partnership, phone: "alert(1)" }).success).toBe(false);
  });
});
