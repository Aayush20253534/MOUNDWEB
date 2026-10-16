import { afterEach, describe, expect, it, vi } from "vitest";
import type { Server } from "node:http";
import { createApp } from "./app.js";
import type { SubmissionStore, NotificationSender } from "./submissions.js";
import type { ContactPayload, PartnershipPayload } from "./submission-schemas.js";

const requestId = "123e4567-e89b-42d3-a456-426614174000";
const payload = {
  requestId, name: "Example Person", email: "person@example.com", phone: "",
  type: "growth", subject: "Brand consultation",
  message: "I would like to discuss a brand growth strategy.",
  consent: true, noticeVersion: "approved-2026",
};
const env = {
  SUBMISSIONS_ENABLED: "true",
  DATABASE_URL: "postgresql://dummy@localhost:5432/dummy",
  RESEND_API_KEY: "fake",
  RESEND_FROM_EMAIL: "sender@example.com",
  RESEND_TO_EMAIL: "admin@example.com",
  CLIENT_ORIGIN: "http://localhost:3000",
  APPROVED_PRIVACY_NOTICE_VERSION: "approved-2026",
};
const counters = {
  save: vi.fn(async (_data: ContactPayload) => ({ id: "accepted-record", duplicate: false })),
  partner: vi.fn(async (_data: PartnershipPayload) => ({ id: "accepted-partner", duplicate: false })),
  notified: vi.fn(async (_data: ContactPayload) => undefined),
  partnerNotified: vi.fn(async (_data: PartnershipPayload) => undefined),
  mark: vi.fn(async (_id: string, _status: string) => undefined),
};
const store: SubmissionStore = {
  saveContact: (...args) => counters.save(...args),
  savePartnership: (...args) => counters.partner(...args),
  setContactEmailStatus: (...args) => counters.mark(...args),
  setPartnershipEmailStatus: (...args) => counters.mark(...args),
};
const sender: NotificationSender = {
  sendContact: (...args) => counters.notified(...args),
  sendPartnership: (...args) => counters.partnerNotified(...args),
};
const running: Server[] = [];
async function start(config = env) {
  const server = await new Promise<Server>((resolve) => {
    const listener = createApp({ env: config, store, sender }).listen(0, "127.0.0.1", () => resolve(listener));
  });
  running.push(server);
  const addr = server.address();
  if (!addr || typeof addr === "string") throw Error("Port missing");
  const base = "http://127.0.0.1:" + addr.port;
  return { base, post: (path: string, data: unknown, origin = "http://localhost:3000") =>
    fetch(base + path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: origin },
      body: JSON.stringify(data),
    }),
  };
}
afterEach(async () => {
  vi.clearAllMocks();
  await Promise.all(running.splice(0).map((server) =>
    new Promise<void>((resolve) => server.close(() => resolve()))));
});
describe("Part 11 public API integration", () => {
  it("provides a safe readiness response and no active processing by default", async () => {
    const instance = await start({ ...env, SUBMISSIONS_ENABLED: "false" });
    const status = await (await fetch(instance.base + "/api/submission-status")).json();
    expect(status).toEqual({ enabled: false, noticeVersion: null });
    const response = await instance.post("/api/v1/inquiries", payload);
    expect(response.status).toBe(503);
    expect(counters.save).not.toHaveBeenCalled();
  });
  it("stores a valid inquiry and sends a notification without exposing PII in response", async () => {
    const instance = await start();
    const response = await instance.post("/api/v1/inquiries", payload);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ receipt: "accepted-record", status: "received", duplicate: false });
    expect(counters.save).toHaveBeenCalledOnce();
    expect(counters.notified).toHaveBeenCalledOnce();
    expect(counters.mark).toHaveBeenCalledWith("accepted-record", "sent");
  });
  it("blocks bad origin, missing consent, stale notice and extra fields", async () => {
    const instance = await start();
    expect((await instance.post("/api/v1/inquiries", payload, "https://evil.example")).status).toBe(403);
    expect((await instance.post("/api/v1/inquiries", { ...payload, consent: false })).status).toBe(422);
    expect((await instance.post("/api/v1/inquiries", { ...payload, noticeVersion: "old" })).status).toBe(409);
    expect((await instance.post("/api/v1/inquiries", { ...payload, isAdmin: true })).status).toBe(422);
    expect(counters.save).not.toHaveBeenCalled();
  });
  it("validates partnership kind independently of frontend and persists approved fields", async () => {
    const instance = await start();
    const form = {
      requestId, name: "College Contact", email: "principal@example.edu",
      phone: "", kind: "colleges", organization: "Example College",
      role: "Principal", location: "Prayagraj", interest: "workshops",
      message: "We want to understand supervised training opportunities.",
      consent: true, noticeVersion: "approved-2026",
    };
    expect((await instance.post("/api/v1/partnerships", { ...form, interest: "market" })).status).toBe(422);
    const response = await instance.post("/api/v1/partnerships", form);
    expect(response.status).toBe(201);
    expect(counters.partner).toHaveBeenCalledOnce();
    expect(counters.partnerNotified).toHaveBeenCalledOnce();
  });
  it("returns accepted receipt when email fails after storage, without claiming delivery", async () => {
    const instance = await start();
    counters.notified.mockRejectedValueOnce(new Error("Resend unavailable"));
    const response = await instance.post("/api/v1/inquiries", payload);
    expect(response.status).toBe(201);
    expect((await response.json()).status).toBe("received");
    expect(counters.mark).toHaveBeenCalledWith("accepted-record", "failed");
  });
  it("returns 503 when storage fails and does not pretend an inquiry was accepted", async () => {
    const instance = await start();
    counters.save.mockRejectedValueOnce(new Error("Neon unavailable"));
    const response = await instance.post("/api/v1/inquiries", payload);
    expect(response.status).toBe(503);
    expect(counters.notified).not.toHaveBeenCalled();
  });
});
