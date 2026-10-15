import { describe, expect, it } from "vitest";
import { validateInquiry, type Inquiry } from "./inquiry";
const valid: Inquiry = {
  name: "Test Learner",
  email: "learner@example.com",
  phone: "+91 98765 43210",
  type: "course",
  subject: "Program information",
  message: "I would like to understand the learning format.",
};
describe("inquiry validation", () => {
  it("accepts a complete inquiry without requiring a phone", () => {
    expect(validateInquiry(valid)).toEqual({});
    expect(validateInquiry({ ...valid, phone: "" })).toEqual({});
  });
  it("does not accept unknown categories or malformed emails", () => {
    expect(
      validateInquiry({ ...valid, type: "unknown", email: "no-email" }),
    ).toMatchObject({ type: expect.any(String), email: expect.any(String) });
  });
  it("rejects blank required fields and focuses useful field-level errors", () => {
    expect(
      Object.keys(
        validateInquiry({ ...valid, name: " ", subject: " ", message: " " }),
      ),
    ).toEqual(["name", "subject", "message"]);
  });
  it("enforces limits and validates international phone digits", () => {
    expect(
      validateInquiry({
        ...valid,
        phone: "letters",
        message: "x".repeat(3001),
      }),
    ).toMatchObject({ phone: expect.any(String), message: expect.any(String) });
    expect(validateInquiry({ ...valid, phone: "+977 9812345678" })).toEqual({});
  });
});
