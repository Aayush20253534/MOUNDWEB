import { describe, expect, it } from "vitest";
import { publicSubmissionStatus, submissionsReady } from "./readiness.js";
const env = {
  SUBMISSIONS_ENABLED: "true",
  DATABASE_URL: "postgresql://dummy@localhost:5432/dummy",
  RESEND_API_KEY: "fake",
  RESEND_FROM_EMAIL: "notify@example.com",
  RESEND_TO_EMAIL: "admin@example.com",
  CLIENT_ORIGIN: "http://localhost:3000",
  APPROVED_PRIVACY_NOTICE_VERSION: "reviewed-2026",
};
describe("Submission readiness", () => {
  it("fails closed when any required configuration is absent", () => {
    expect(submissionsReady({})).toBe(false);
    expect(submissionsReady({ ...env, SUBMISSIONS_ENABLED: "false" })).toBe(false);
    expect(submissionsReady({ ...env, RESEND_TO_EMAIL: "" })).toBe(false);
    expect(submissionsReady({ ...env, APPROVED_PRIVACY_NOTICE_VERSION: "pending" })).toBe(false);
    expect(publicSubmissionStatus({}).enabled).toBe(false);
  });
  it("exposes only readiness and the approved privacy version", () => {
    expect(publicSubmissionStatus(env)).toEqual({ enabled: true, noticeVersion: "reviewed-2026" });
  });
});
