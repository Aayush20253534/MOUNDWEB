import { createHash, randomBytes } from "node:crypto";
import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { createSubmissionRateLimiter } from "./rate-limit.js";
import type {
  AdminActor, AdminStore, EditorialInput, EditorialRecord, LeadKind, LeadState,
} from "./admin-store.js";

type AdminRequest = Request & { moundAdmin?: AdminActor; moundTokenHash?: string };
type AdminRouterOptions = {
  env?: NodeJS.ProcessEnv;
  store?: AdminStore;
  verifyPassword?: (plain: string, hash: string) => Promise<boolean>;
  now?: () => Date;
  createToken?: () => string;
};
const SESSION_COOKIE = "mound_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const roles = ["ADMIN", "EDITOR"] as const;
const leadStates = ["NEW", "IN_REVIEW", "RESOLVED", "ARCHIVED"] as const;
const emailSchema = z.string().trim().toLowerCase().email().max(254);
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(256),
}).strict();
const leadUpdateSchema = z.object({
  status: z.enum(leadStates),
  internalNote: z.string().trim().max(2000).optional(),
}).strict();
const shortText = (max: number) => z.string().trim().min(1).max(max);
const stringList = (maxItems: number, maxLength: number) =>
  z.array(z.string().trim().min(1).max(maxLength)).max(maxItems);
const editorialSchema = z.object({
  title: shortText(140),
  category: shortText(60),
  summary: shortText(600),
  artwork: shortText(400),
  caption: z.string().trim().max(600).optional().default(""),
  topics: stringList(12, 120).optional().default([]),
  outline: stringList(16, 260).min(1),
  body: stringList(24, 5000).optional().default([]),
  audioUrl: z.string().trim().max(1000).optional().default(""),
  durationSeconds: z.number().int().min(1).max(24 * 60 * 60).optional(),
  transcript: z.string().trim().max(60000).optional().default(""),
  author: z.string().trim().max(100).optional().default(""),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
}).strict();
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isEmailAllowed = (env: NodeJS.ProcessEnv, req: Request) => {
  const origins = [env.CLIENT_ORIGIN, env.ADMIN_CLIENT_ORIGIN]
    .flatMap((value) => (value ?? "").split(","))
    .map((value) => value.trim()).filter(Boolean);
  const origin = req.get("Origin");
  return Boolean(origin && origins.includes(origin));
};
function adminEnabled(env: NodeJS.ProcessEnv) {
  return env.ADMIN_ENABLED === "true" && Boolean(env.DATABASE_URL);
}
function digest(token: string) { return createHash("sha256").update(token).digest("hex"); }
function cookieToken(req: Request) {
  const raw = req.headers.cookie ?? "";
  const pair = raw.split(";").map((item) => item.trim()).find((item) => item.startsWith(SESSION_COOKIE + "="));
  const value = pair?.slice(SESSION_COOKIE.length + 1);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : undefined;
}
function cookieOptions(env: NodeJS.ProcessEnv) {
  const secure = env.ADMIN_COOKIE_SECURE === "true" || env.NODE_ENV === "production";
  const sameSite = (env.ADMIN_COOKIE_SAME_SITE ?? "Lax").toLowerCase();
  const normalized = sameSite === "none" ? "None" : sameSite === "strict" ? "Strict" : "Lax";
  return { secure, sameSite: normalized };
}
function setSessionCookie(res: Response, token: string, env: NodeJS.ProcessEnv) {
  const options = cookieOptions(env);
  const parts = [
    SESSION_COOKIE + "=" + token, "Path=/api/v1/admin", "HttpOnly",
    "SameSite=" + options.sameSite, "Max-Age=" + String(SESSION_TTL_MS / 1000),
  ];
  if (options.secure) parts.push("Secure");
  const domain = env.ADMIN_COOKIE_DOMAIN?.trim();
  if (domain && /^\.?[a-z0-9.-]+$/i.test(domain) && !domain.includes("..")) parts.push("Domain=" + domain);
  res.append("Set-Cookie", parts.join("; "));
}
function clearSessionCookie(res: Response, env: NodeJS.ProcessEnv) {
  const options = cookieOptions(env);
  const parts = [SESSION_COOKIE + "=", "Path=/api/v1/admin", "HttpOnly", "Max-Age=0", "SameSite=" + options.sameSite];
  if (options.secure) parts.push("Secure");
  const domain = env.ADMIN_COOKIE_DOMAIN?.trim();
  if (domain && /^\.?[a-z0-9.-]+$/i.test(domain) && !domain.includes("..")) parts.push("Domain=" + domain);
  res.append("Set-Cookie", parts.join("; "));
}
function noStore(res: Response) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");
}
function jsonRequest(req: Request, res: Response) {
  if (!req.is("application/json")) {
    res.status(415).json({ error: "Use application/json." });
    return false;
  }
  return true;
}
function validateEditorial(kind: "PODCAST" | "MEDIA", slug: string, input: z.infer<typeof editorialSchema>, env: NodeJS.ProcessEnv): EditorialInput | string {
  const cats = kind === "PODCAST"
    ? ["Brand Growth", "Creative Thinking", "Digital Learning"]
    : ["Perspectives", "Learning", "Studio Notes"];
  if (!cats.includes(input.category)) return "Choose a category supported by this editorial section.";
  if (!slugPattern.test(slug) || slug.length > 100) return "Slug must use lowercase letters, numbers and hyphens.";
  if (!input.artwork.startsWith("/assets/") || input.artwork.includes("..") || input.artwork.includes("\\") || input.artwork.includes("?") || input.artwork.includes("#"))
    return "Artwork must reference an approved local asset under /assets/.";
  if (input.status === "PUBLISHED") {
    if (kind === "PODCAST") {
      const audio = input.audioUrl;
      const allowedOrigins = (env.EDITORIAL_MEDIA_ORIGINS ?? "").split(",").map((v) => v.trim()).filter(Boolean);
      const safeLocal = Boolean(audio && audio.startsWith("/assets/audio/") && !audio.includes("..") && /\.(mp3|m4a|ogg|wav)$/i.test(audio));
      let safeRemote = false;
      if (audio && audio.startsWith("https://") && /\.(mp3|m4a|ogg|wav)(\?.*)?$/i.test(audio)) {
        try {
          const url = new URL(audio);
          safeRemote = !url.username && !url.password && allowedOrigins.includes(url.origin);
        } catch { safeRemote = false; }
      }
      if (!safeLocal && !safeRemote) return "A podcast cannot be published without an approved audio asset or allow-listed HTTPS media URL.";
      if (!input.transcript.trim()) return "A podcast cannot be published without its accessible transcript.";
      if (!input.durationSeconds || input.durationSeconds < 1) return "A positive verified duration is required to publish a podcast.";
    } else {
      if (!input.author.trim() || input.body.length === 0 || input.body.some((paragraph) => !paragraph.trim()))
        return "A media release requires an author and non-empty reviewed article body.";
    }
  }
  return {
    kind, slug, title: input.title, category: input.category, summary: input.summary,
    artwork: input.artwork, caption: input.caption, topics: input.topics, outline: input.outline,
    body: input.body, audioUrl: input.audioUrl || undefined,
    durationSeconds: input.durationSeconds, transcript: input.transcript || undefined,
    author: input.author || undefined, status: input.status,
  };
}
export function createAdminRouter(options: AdminRouterOptions = {}) {
  const env = options.env ?? process.env;
  const router = Router();
  const now = options.now ?? (() => new Date());
  const createToken = options.createToken ?? (() => randomBytes(32).toString("hex"));
  let adminStore = options.store;
  async function getStore() {
    if (adminStore) return adminStore;
    const module = await import("./admin-store.js");
    adminStore = module.createPrismaAdminStore();
    return adminStore;
  }
  let verifyPassword = options.verifyPassword;
  let dummyHashPromise: Promise<string> | undefined;
  async function verify(plain: string, hash: string) {
    if (verifyPassword) return verifyPassword(plain, hash);
    const argon2 = await import("argon2");
    return argon2.verify(hash, plain);
  }
  async function dummyHash() {
    if (!dummyHashPromise) dummyHashPromise = (async () => {
      const argon2 = await import("argon2");
      return argon2.hash("moundweb-unknown-account-dummy-password");
    })();
    return dummyHashPromise;
  }
  const loginLimiter = createSubmissionRateLimiter({ max: 5, windowMs: 15 * 60 * 1000 });
  router.use((_req, res, next) => { noStore(res); next(); });
  router.post("/login", loginLimiter, async (req, res) => {
    if (!adminEnabled(env)) { res.status(503).json({ error: "Admin access is disabled or not configured." }); return; }
    if (!isEmailAllowed(env, req)) { res.status(403).json({ error: "Origin not permitted." }); return; }
    if (!jsonRequest(req, res)) return;
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ error: "Enter a valid email and password." }); return; }
    try {
      const store = await getStore();
      const user = await store.findUserByEmail(parsed.data.email);
      const matches = user
        ? await verify(parsed.data.password, user.passwordHash).catch(() => false)
        : await verify(parsed.data.password, await dummyHash()).then(() => false).catch(() => false);
      if (!user || !user.active || !matches || !roles.includes(user.role as typeof roles[number])) {
        res.status(401).json({ error: "Email or password is incorrect." });
        return;
      }
      const token = createToken();
      if (!/^[a-f0-9]{64}$/.test(token)) { res.status(500).json({ error: "Unable to create an admin session." }); return; }
      const tokenHash = digest(token);
      await store.createSession(tokenHash, user.id, new Date(now().getTime() + SESSION_TTL_MS));
      await store.audit({ adminId: user.id, action: "admin.login", entityType: "session" });
      setSessionCookie(res, token, env);
      res.status(200).json({ user: { id: user.id, email: user.email, role: user.role }, expiresIn: SESSION_TTL_MS / 1000 });
    } catch {
      res.status(503).json({ error: "Admin login is temporarily unavailable." });
    }
  });
  router.post("/logout", async (req, res) => {
    if (!isEmailAllowed(env, req)) { res.status(403).json({ error: "Origin not permitted." }); return; }
    const token = cookieToken(req);
    if (token) {
      try {
        const store = await getStore();
        const session = await store.findSession(digest(token), now());
        await store.revokeSession(digest(token), now());
        if (session) await store.audit({ adminId: session.admin.id, action: "admin.logout", entityType: "session", entityId: session.id });
      } catch {
        res.status(503).json({ error: "Unable to end this session. Retry shortly." });
        return;
      }
    }
    clearSessionCookie(res, env);
    res.status(204).end();
  });
  async function authenticate(req: AdminRequest, res: Response, next: NextFunction) {
    if (!adminEnabled(env)) { res.status(503).json({ error: "Admin access is disabled or not configured." }); return; }
    const token = cookieToken(req);
    if (!token) { res.status(401).json({ error: "Authentication required." }); return; }
    try {
      const store = await getStore();
      const session = await store.findSession(digest(token), now());
      if (!session || !session.admin.active) {
        clearSessionCookie(res, env);
        res.status(401).json({ error: "Session expired. Sign in again." });
        return;
      }
      req.moundAdmin = { id: session.admin.id, email: session.admin.email, role: session.admin.role };
      req.moundTokenHash = digest(token);
      next();
    } catch {
      res.status(503).json({ error: "Admin service is temporarily unavailable." });
    }
  }
  function requireRole(...allowed: ("ADMIN" | "EDITOR")[]) {
    return (req: AdminRequest, res: Response, next: NextFunction) => {
      if (!req.moundAdmin || !allowed.includes(req.moundAdmin.role)) {
        res.status(403).json({ error: "Your role cannot access this resource." });
        return;
      }
      next();
    };
  }
  function requireOrigin(req: Request, res: Response) {
    if (!isEmailAllowed(env, req)) { res.status(403).json({ error: "Origin not permitted." }); return false; }
    return jsonRequest(req, res);
  }
  router.get("/me", authenticate, (req: AdminRequest, res) => {
    if (!req.moundAdmin) { res.status(401).json({ error: "Authentication required." }); return; }
    res.json({ user: req.moundAdmin });
  });
  router.get("/summary", authenticate, async (req: AdminRequest, res) => {
    try {
      const summary = await (await getStore()).summary();
      res.json(req.moundAdmin?.role === "ADMIN" ? summary : {
        editorialDrafts: summary.editorialDrafts, editorialPublished: summary.editorialPublished,
      });
    } catch { res.status(503).json({ error: "Unable to load dashboard metrics." }); }
  });
  const listSchema = z.object({
    page: z.coerce.number().int().min(1).max(100000).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    status: z.enum(leadStates).optional(),
  }).strict();
  function listRoute(kind: LeadKind) {
    return async (req: AdminRequest, res: Response) => {
      const query = listSchema.safeParse(req.query);
      if (!query.success) { res.status(422).json({ error: "Invalid pagination or status filter." }); return; }
      try {
        const result = await (await getStore()).listLeads(kind, query.data.page, query.data.limit, query.data.status as LeadState | undefined);
        res.json(result);
      } catch { res.status(503).json({ error: "Unable to load submissions." }); }
    };
  }
  router.get("/inquiries", authenticate, requireRole("ADMIN"), listRoute("inquiry"));
  router.get("/partnerships", authenticate, requireRole("ADMIN"), listRoute("partnership"));
  const idSchema = z.string().uuid();
  async function updateLeadRoute(kind: LeadKind, req: AdminRequest, res: Response) {
    if (!req.moundAdmin) { res.status(401).json({ error: "Authentication required." }); return; }
    if (!requireOrigin(req, res)) return;
    const id = idSchema.safeParse(req.params.id);
    const parsed = leadUpdateSchema.safeParse(req.body);
    if (!id.success || !parsed.success) { res.status(422).json({ error: "Invalid update fields." }); return; }
    try {
      await (await getStore()).updateLead(kind, id.data, parsed.data.status as LeadState, parsed.data.internalNote, req.moundAdmin);
      res.json({ updated: true });
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
        res.status(404).json({ error: "Submission not found." }); return;
      }
      res.status(503).json({ error: "Unable to update submission." });
    }
  }
  router.patch("/inquiries/:id", authenticate, requireRole("ADMIN"), (req: AdminRequest, res) => { void updateLeadRoute("inquiry", req, res); });
  router.patch("/partnerships/:id", authenticate, requireRole("ADMIN"), (req: AdminRequest, res) => { void updateLeadRoute("partnership", req, res); });

  router.get("/editorial", authenticate, requireRole("ADMIN", "EDITOR"), async (req: AdminRequest, res) => {
    const kind = typeof req.query.kind === "string" ? req.query.kind.toUpperCase() : undefined;
    if (kind !== undefined && kind !== "PODCAST" && kind !== "MEDIA") {
      res.status(422).json({ error: "Choose podcast or media." }); return;
    }
    try {
      const items = await (await getStore()).listEditorial(kind as "PODCAST" | "MEDIA" | undefined);
      res.json({ items });
    } catch { res.status(503).json({ error: "Unable to load editorial records." }); }
  });
  router.put("/editorial/:kind/:slug", authenticate, requireRole("ADMIN", "EDITOR"), async (req: AdminRequest, res) => {
    if (!req.moundAdmin) { res.status(401).json({ error: "Authentication required." }); return; }
    if (!requireOrigin(req, res)) return;
    const kind = req.params.kind.toUpperCase();
    if (kind !== "PODCAST" && kind !== "MEDIA") { res.status(404).json({ error: "Unknown editorial section." }); return; }
    const parsed = editorialSchema.safeParse(req.body);
    if (!parsed.success) { res.status(422).json({ error: "Invalid editorial fields.", fields: parsed.error.flatten().fieldErrors }); return; }
    const validated = validateEditorial(kind, req.params.slug, parsed.data, env);
    if (typeof validated === "string") { res.status(422).json({ error: validated }); return; }
    try {
      const item = await (await getStore()).upsertEditorial(validated, req.moundAdmin);
      res.json({ item });
    } catch { res.status(503).json({ error: "Unable to save editorial record." }); }
  });
  return router;
}
export function isAdminPublishingRecord(record: EditorialRecord, allowedMediaOrigins: string[] = []) {
  if (record.status !== "PUBLISHED" || !record.publishedAt) return false;
  if (record.kind === "PODCAST") {
    const src = record.audioUrl;
    const local = Boolean(src && src.startsWith("/assets/audio/") && !src.includes("..") && /\.(mp3|m4a|ogg|wav)$/i.test(src));
    let remote = false;
    if (src?.startsWith("https://") && /\.(mp3|m4a|ogg|wav)(\?.*)?$/i.test(src)) {
      try { const u = new URL(src); remote = !u.username && !u.password && allowedMediaOrigins.includes(u.origin); } catch { remote = false; }
    }
    return (local || remote) && Boolean(record.transcript?.trim() && record.durationSeconds && record.durationSeconds > 0);
  }
  return Boolean(record.author?.trim() && record.body.length > 0 && record.body.every((part) => part.trim().length > 0));
}
