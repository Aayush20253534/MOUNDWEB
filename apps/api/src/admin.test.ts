import { afterEach, describe, expect, it, vi } from "vitest";
import type { Server } from "node:http";
import { createApp } from "./app.js";
import { isAdminPublishingRecord } from "./admin.js";
import type { AdminActor, AdminAccount, AdminStore, EditorialInput, EditorialRecord, LeadKind, LeadState } from "./admin-store.js";

const admin: AdminAccount = { id: "123e4567-e89b-42d3-a456-426614174001", email: "admin@example.test", passwordHash: "admin-hash", role: "ADMIN", active: true };
const editor: AdminAccount = { id: "123e4567-e89b-42d3-a456-426614174002", email: "editor@example.test", passwordHash: "editor-hash", role: "EDITOR", active: true };
const records = new Map<string, { id: string; expiresAt: Date; admin: AdminActor & { active: boolean }; revoked: boolean }>();
const callLog = {
  audits: vi.fn(async (_entry: { adminId: string; action: string; entityType: string; entityId?: string }) => undefined),
  leadUpdates: vi.fn(async (_kind: LeadKind, _id: string, _status: LeadState, _note: string | undefined, _actor: AdminActor) => undefined),
  saves: vi.fn(async (_input: EditorialInput, _actor: AdminActor) => undefined),
};
let editorial: EditorialRecord[] = [];
const store: AdminStore = {
  async findUserByEmail(email) { return [admin, editor].find((user) => user.email === email) ?? null; },
  async createSession(tokenHash, adminId, expiresAt) {
    const user = [admin, editor].find((item) => item.id === adminId);
    if (user) records.set(tokenHash, { id: "session-" + user.role, expiresAt, admin: { id: user.id, email: user.email, role: user.role, active: user.active }, revoked: false });
  },
  async findSession(tokenHash, now) {
    const record = records.get(tokenHash);
    return record && !record.revoked && record.expiresAt > now ? { id: record.id, expiresAt: record.expiresAt, admin: record.admin } : null;
  },
  async revokeSession(tokenHash) { const record = records.get(tokenHash); if (record) record.revoked = true; },
  audit: (...args) => callLog.audits(...args),
  async summary() { return { inquiries: 8, partnerships: 2, editorialDrafts: editorial.filter((item) => item.status === "DRAFT").length, editorialPublished: editorial.filter((item) => item.status === "PUBLISHED").length }; },
  async listLeads(kind, page, limit, status) {
    return { page, limit, total: 1, items: [{ id: "123e4567-e89b-42d3-a456-426614174099", kind, name: "Private test record", status: status ?? "NEW" }] };
  },
  updateLead: (...args) => callLog.leadUpdates(...args),
  async listEditorial(kind) { return kind ? editorial.filter((item) => item.kind === kind) : editorial; },
  async upsertEditorial(input, actor) {
    await callLog.saves(input, actor);
    const old = editorial.find((entry) => entry.kind === input.kind && entry.slug === input.slug);
    const record: EditorialRecord = {
      ...input, id: old?.id ?? "123e4567-e89b-42d3-a456-426614174098",
      publishedAt: input.status === "PUBLISHED" ? old?.publishedAt ?? new Date("2026-10-16T00:00:00.000Z") : null,
      createdAt: old?.createdAt ?? new Date("2026-10-01T00:00:00.000Z"),
      updatedAt: new Date("2026-10-16T00:00:00.000Z"),
    };
    editorial = [...editorial.filter((entry) => !(entry.kind === input.kind && entry.slug === input.slug)), record];
    return record;
  },
  async listPublishedEditorial(kind) { return editorial.filter((item) => item.kind === kind && item.status === "PUBLISHED"); },
  async findPublishedEditorial(kind, slug) { return editorial.find((item) => item.kind === kind && item.slug === slug && item.status === "PUBLISHED") ?? null; },
};

const env = {
  ADMIN_ENABLED: "true", DATABASE_URL: "postgresql://not-a-real-db",
  CLIENT_ORIGIN: "http://localhost:3000", ADMIN_CLIENT_ORIGIN: "http://localhost:3000",
  ADMIN_COOKIE_SECURE: "false", ADMIN_COOKIE_SAME_SITE: "Lax",
};
const servers: Server[] = [];
async function start(config: NodeJS.ProcessEnv = env) {
  const app = createApp({
    env: config, adminStore: store,
    verifyAdminPassword: async (plain, hash) => plain === "correct-password-phrase" && hash.endsWith("-hash"),
  });
  const server = await new Promise<Server>((resolve) => {
    const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
  });
  servers.push(server);
  const address = server.address();
  if (!address || typeof address === "string") throw Error("No API port");
  const base = "http://127.0.0.1:" + address.port;
  return {
    base,
    request: (path: string, init: RequestInit = {}, cookie?: string, origin = "http://localhost:3000") =>
      fetch(base + path, {
        ...init,
        headers: {
          ...(init.body ? { "Content-Type": "application/json" } : {}),
          Origin: origin,
          ...(cookie ? { Cookie: cookie } : {}),
          ...(init.headers ?? {}),
        },
      }),
    async login(email = admin.email) {
      const response = await fetch(base + "/api/v1/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
        body: JSON.stringify({ email, password: "correct-password-phrase" }),
      });
      const raw = response.headers.get("set-cookie") ?? "";
      const match = raw.match(/mound_admin_session=([a-f0-9]{64})/);
      return { response, cookie: match?.[0] ?? "" };
    },
  };
}
afterEach(async () => {
  callLog.audits.mockClear(); callLog.leadUpdates.mockClear(); callLog.saves.mockClear();
  records.clear(); editorial = [];
  await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve()))));
});
describe("Part 12 authenticated admin boundary", () => {
  it("keeps administration disabled unless explicitly enabled with database configuration", async () => {
    const instance = await start({ ...env, ADMIN_ENABLED: "false" });
    const response = await instance.request("/api/v1/admin/login", {
      method: "POST", body: JSON.stringify({ email: admin.email, password: "correct-password-phrase" }),
    });
    expect(response.status).toBe(503);
    const noDb = await start({ ...env, DATABASE_URL: "" });
    expect((await noDb.request("/api/v1/admin/login", {
      method: "POST", body: JSON.stringify({ email: admin.email, password: "correct-password-phrase" }),
    })).status).toBe(503);
  });
  it("requires an allowed browser origin and does not reveal whether an account exists", async () => {
    const instance = await start();
    const badOrigin = await instance.request("/api/v1/admin/login", {
      method: "POST", body: JSON.stringify({ email: admin.email, password: "correct-password-phrase" }),
    }, undefined, "https://attacker.example");
    expect(badOrigin.status).toBe(403);
    const wrong = await instance.request("/api/v1/admin/login", {
      method: "POST", body: JSON.stringify({ email: "admin@example.test", password: "incorrect-password-phrase" }),
    });
    expect(wrong.status).toBe(401);
    expect(await wrong.json()).toEqual({ error: "Email or password is incorrect." });
    expect(wrong.headers.get("cache-control")).toContain("no-store");
  });
  it("creates an HTTP-only cookie session, restricts lead access and revokes logout sessions", async () => {
    const instance = await start();
    expect((await instance.request("/api/v1/admin/inquiries")).status).toBe(401);
    const { response, cookie } = await instance.login();
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("SameSite=Lax");
    expect(cookie).toMatch(/^mound_admin_session=[a-f0-9]{64}$/);
    const me = await instance.request("/api/v1/admin/me", {}, cookie);
    expect(me.status).toBe(200);
    expect(await me.json()).toMatchObject({ user: { email: admin.email, role: "ADMIN" } });
    const leads = await instance.request("/api/v1/admin/inquiries?page=1&limit=20", {}, cookie);
    expect(leads.status).toBe(200);
    expect((await leads.json() as { items: unknown[] }).items).toHaveLength(1);
    const logout = await instance.request("/api/v1/admin/logout", { method: "POST", body: "{}" }, cookie);
    expect(logout.status).toBe(204);
    expect((await instance.request("/api/v1/admin/me", {}, cookie)).status).toBe(401);
    expect((await instance.request("/api/v1/admin/inquiries", {}, cookie)).status).toBe(401);
  });
  it("limits the editor role to publishing and logs workflow changes", async () => {
    const instance = await start();
    const { response, cookie } = await instance.login(editor.email);
    expect(response.status).toBe(200);
    expect((await instance.request("/api/v1/admin/inquiries", {}, cookie)).status).toBe(403);
    const summary = await instance.request("/api/v1/admin/summary", {}, cookie);
    expect(summary.status).toBe(200);
    expect(await summary.json()).toEqual({ editorialDrafts: 0, editorialPublished: 0 });
  });
  it("validates lead state changes and only allows updates from an authorized origin", async () => {
    const instance = await start();
    const { cookie } = await instance.login();
    const id = "123e4567-e89b-42d3-a456-426614174099";
    const originBlocked = await instance.request("/api/v1/admin/inquiries/" + id, {
      method: "PATCH", body: JSON.stringify({ status: "RESOLVED" }),
    }, cookie, "https://attacker.example");
    expect(originBlocked.status).toBe(403);
    const invalid = await instance.request("/api/v1/admin/inquiries/" + id, {
      method: "PATCH", body: JSON.stringify({ status: "delete-all" }),
    }, cookie);
    expect(invalid.status).toBe(422);
    const valid = await instance.request("/api/v1/admin/inquiries/" + id, {
      method: "PATCH", body: JSON.stringify({ status: "IN_REVIEW", internalNote: "Follow up with context." }),
    }, cookie);
    expect(valid.status).toBe(200);
    expect(callLog.leadUpdates).toHaveBeenCalledOnce();
    expect(callLog.audits).toHaveBeenCalled();
  });
  it("prevents public publishing of incomplete content and serves only verified releases", async () => {
    const instance = await start();
    const { cookie } = await instance.login();
    const incompleteEpisode = await instance.request("/api/v1/admin/editorial/podcast/unreleased-concept", {
      method: "PUT",
      body: JSON.stringify({ title: "A good interview", category: "Brand Growth", summary: "An idea under review.",
        artwork: "/assets/services/seo.webp", outline: ["Opening"], status: "PUBLISHED" }),
    }, cookie);
    expect(incompleteEpisode.status).toBe(422);
    const mediaBody = { title: "A verified perspective", category: "Perspectives", summary: "A reviewed editorial article for readers.",
      artwork: "/assets/services/seo.webp", caption: "Illustrative design artwork", topics: [], outline: ["Context", "Questions"],
      body: ["This is the first reviewed paragraph."], author: "Editorial Desk", status: "PUBLISHED" };
    const published = await instance.request("/api/v1/admin/editorial/media/a-verified-perspective", {
      method: "PUT", body: JSON.stringify(mediaBody),
    }, cookie);
    expect(published.status).toBe(200);
    expect((await published.json() as { item: { status: string } }).item.status).toBe("PUBLISHED");
    const publicList = await instance.request("/api/v1/editorial/media");
    expect(publicList.status).toBe(200);
    const data = await publicList.json() as { items: Array<{ slug: string; status: string; author: string }> };
    expect(data.items).toHaveLength(1);
    expect(data.items[0]).toMatchObject({ slug: "a-verified-perspective", status: "published", author: "Editorial Desk" });
    expect(JSON.stringify(data)).not.toContain("editedById");
  });
});

describe("Editorial publication gate", () => {
  it("never exposes incomplete podcast audio/transcript or media bodies", () => {
    const base = {
      id: "entry-id", slug: "a-story", title: "A story", category: "Perspectives", summary: "A sufficiently detailed editorial summary.",
      artwork: "/assets/services/seo.webp", caption: "Concept artwork", topics: [], outline: ["One"], body: [], status: "PUBLISHED" as const,
      audioUrl: undefined, durationSeconds: undefined, transcript: undefined, author: undefined,
      publishedAt: new Date("2026-10-16T00:00:00.000Z"), createdAt: new Date(), updatedAt: new Date(),
    };
    expect(isAdminPublishingRecord({ ...base, kind: "MEDIA" })).toBe(false);
    expect(isAdminPublishingRecord({ ...base, kind: "MEDIA", author: "Editorial Desk", body: ["Reviewed article text."] })).toBe(true);
    expect(isAdminPublishingRecord({ ...base, kind: "PODCAST", audioUrl: "https://untrusted.example/audio.mp3", durationSeconds: 60, transcript: "A reviewed transcript." }, [])).toBe(false);
    expect(isAdminPublishingRecord({ ...base, kind: "PODCAST", audioUrl: "/assets/audio/approved.mp3", durationSeconds: 60, transcript: "A reviewed transcript." })).toBe(true);
  });
});
