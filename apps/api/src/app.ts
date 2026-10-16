import cors from "cors";
import express from "express";
import helmet from "helmet";
import { z } from "zod";
import { createSubmissionRateLimiter } from "./rate-limit.js";
import { publicSubmissionStatus, submissionsReady } from "./readiness.js";
import { contactSchema, partnershipSchema, type ContactPayload, type PartnershipPayload } from "./submission-schemas.js";
import type { SubmissionStore, NotificationSender } from "./submissions.js";

type AppOptions = {
  env?: NodeJS.ProcessEnv;
  store?: SubmissionStore;
  sender?: NotificationSender;
};
export function createApp(options: AppOptions = {}) {
  const env = options.env ?? process.env;
  const app = express();
  app.disable("x-powered-by");
  if (env.TRUST_PROXY === "true") app.set("trust proxy", 1);
  app.use(helmet());
  const origins = (env.CLIENT_ORIGIN ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  app.use(cors({ origin: origins.length ? origins : false, methods: ["GET", "POST"], allowedHeaders: ["Content-Type"] }));
  app.use(express.json({ limit: "15kb" }));

  app.get("/api/health", (_req, res) =>
    res.status(200).json({ status: "ok", service: "moundweb-api" }));
  app.get("/api/submission-status", (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(publicSubmissionStatus(env));
  });

  const throttle = createSubmissionRateLimiter();
  function authorize(req: express.Request, res: express.Response): boolean {
    if (!submissionsReady(env)) {
      res.status(503).json({ error: "Submissions are not yet available." });
      return false;
    }
    const origin = req.get("Origin");
    if (!origin || !origins.includes(origin)) {
      res.status(403).json({ error: "Origin not permitted." });
      return false;
    }
    if (!req.is("application/json")) {
      res.status(415).json({ error: "Use application/json." });
      return false;
    }
    return true;
  }
  async function dependencies() {
    if (options.store && options.sender) return { store: options.store, sender: options.sender };
    const { createPrismaStore, createResendSender } = await import("./submissions.js");
    return { store: createPrismaStore(), sender: createResendSender() };
  }
  async function acceptedContact(value: ContactPayload) {
    const { store, sender } = await dependencies();
    const saved = await store.saveContact(value);
    if (!saved.duplicate) {
      try {
        await sender.sendContact(value);
        await store.setContactEmailStatus(saved.id, "sent");
      } catch {
        // Submission is safely stored even if email fails; never claim email delivery.
        console.error("Contact notification pending", { requestId: value.requestId });
        try { await store.setContactEmailStatus(saved.id, "failed"); } catch {
          console.error("Notification status update pending", { requestId: value.requestId });
        }
      }
    }
    return { receipt: saved.id, status: "received" as const, duplicate: saved.duplicate };
  }
  async function acceptedPartnership(value: PartnershipPayload) {
    const { store, sender } = await dependencies();
    const saved = await store.savePartnership(value);
    if (!saved.duplicate) {
      try {
        await sender.sendPartnership(value);
        await store.setPartnershipEmailStatus(saved.id, "sent");
      } catch {
        console.error("Partnership notification pending", { requestId: value.requestId });
        try { await store.setPartnershipEmailStatus(saved.id, "failed"); } catch {
          console.error("Notification status update pending", { requestId: value.requestId });
        }
      }
    }
    return { receipt: saved.id, status: "received" as const, duplicate: saved.duplicate };
  }
  app.post("/api/v1/inquiries", throttle, async (req, res) => {
    if (!authorize(req, res)) return;
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: "Invalid inquiry fields.", fields: parsed.error.flatten().fieldErrors });
      return;
    }
    if (parsed.data.noticeVersion !== env.APPROVED_PRIVACY_NOTICE_VERSION) {
      res.status(409).json({ error: "Privacy notice was updated. Review before submitting." });
      return;
    }
    try {
      const result = await acceptedContact(parsed.data);
      res.setHeader("Cache-Control", "no-store");
      res.status(result.duplicate ? 200 : 201).json(result);
    } catch {
      console.error("Inquiry could not be stored", { requestId: parsed.data.requestId });
      res.status(503).json({ error: "Unable to accept inquiry right now. Try again later." });
    }
  });
  app.post("/api/v1/partnerships", throttle, async (req, res) => {
    if (!authorize(req, res)) return;
    const parsed = partnershipSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: "Invalid partnership fields.", fields: parsed.error.flatten().fieldErrors });
      return;
    }
    if (parsed.data.noticeVersion !== env.APPROVED_PRIVACY_NOTICE_VERSION) {
      res.status(409).json({ error: "Privacy notice was updated. Review before submitting." });
      return;
    }
    try {
      const result = await acceptedPartnership(parsed.data);
      res.setHeader("Cache-Control", "no-store");
      res.status(result.duplicate ? 200 : 201).json(result);
    } catch {
      console.error("Partnership could not be stored", { requestId: parsed.data.requestId });
      res.status(503).json({ error: "Unable to accept partnership right now. Try again later." });
    }
  });
  app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));
  app.use((
    error: unknown, _req: express.Request,
    res: express.Response, _next: express.NextFunction,
  ) => {
    const invalidJson = error instanceof SyntaxError && "body" in error;
    const message = error instanceof z.ZodError || invalidJson ? "Invalid request" : "Internal server error";
    res.status(invalidJson || error instanceof z.ZodError ? 400 : 500).json({ error: message });
  });
  return app;
}
