import {
  AdminRole, EditorialKind, EditorialStatus, Prisma, PrismaClient, SubmissionStatus,
} from "@prisma/client";
import { getDatabase } from "./database.js";

export type AdminActor = { id: string; email: string; role: "ADMIN" | "EDITOR" };
export type LeadKind = "inquiry" | "partnership";
export type LeadState = "NEW" | "IN_REVIEW" | "RESOLVED" | "ARCHIVED";
export type AdminAccount = {
  id: string; email: string; passwordHash: string;
  role: "ADMIN" | "EDITOR"; active: boolean;
};
export type EditorialInput = {
  kind: "PODCAST" | "MEDIA";
  slug: string; title: string; category: string; summary: string;
  artwork: string; caption?: string; topics: string[]; outline: string[];
  body: string[]; audioUrl?: string; durationSeconds?: number;
  transcript?: string; author?: string; status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};
export type EditorialRecord = EditorialInput & {
  id: string; publishedAt: Date | null; createdAt: Date; updatedAt: Date;
};

export interface AdminStore {
  findUserByEmail(email: string): Promise<AdminAccount | null>;
  createSession(tokenHash: string, adminId: string, expiresAt: Date): Promise<void>;
  findSession(tokenHash: string, now: Date): Promise<{
    id: string; expiresAt: Date; admin: AdminActor & { active: boolean };
  } | null>;
  revokeSession(tokenHash: string, now: Date): Promise<void>;
  audit(input: { adminId: string; action: string; entityType: string; entityId?: string }): Promise<void>;
  summary(): Promise<{ inquiries: number; partnerships: number; editorialDrafts: number; editorialPublished: number }>;
  listLeads(kind: LeadKind, page: number, limit: number, status?: LeadState): Promise<{
    page: number; limit: number; total: number; items: Record<string, unknown>[];
  }>;
  updateLead(kind: LeadKind, id: string, status: LeadState, internalNote: string | undefined, actor: AdminActor): Promise<void>;
  listEditorial(kind?: "PODCAST" | "MEDIA"): Promise<EditorialRecord[]>;
  upsertEditorial(input: EditorialInput, actor: AdminActor): Promise<EditorialRecord>;
  listPublishedEditorial(kind: "PODCAST" | "MEDIA"): Promise<EditorialRecord[]>;
  findPublishedEditorial(kind: "PODCAST" | "MEDIA", slug: string): Promise<EditorialRecord | null>;
}

type Database = PrismaClient;
function toAdminAccount(value: { id: string; email: string; passwordHash: string; role: AdminRole; active: boolean }): AdminAccount {
  return { ...value, role: value.role as AdminAccount["role"] };
}
function toEditorial(value: {
  id: string; kind: EditorialKind; slug: string; title: string; category: string; summary: string;
  artwork: string; caption: string | null; topics: string[]; outline: string[]; body: string[];
  audioUrl: string | null; durationSeconds: number | null; transcript: string | null; author: string | null;
  status: EditorialStatus; publishedAt: Date | null; createdAt: Date; updatedAt: Date;
}): EditorialRecord {
  return {
    ...value, kind: value.kind as EditorialRecord["kind"], status: value.status as EditorialRecord["status"],
    caption: value.caption ?? undefined, audioUrl: value.audioUrl ?? undefined,
    durationSeconds: value.durationSeconds ?? undefined, transcript: value.transcript ?? undefined,
    author: value.author ?? undefined,
  };
}
export function createPrismaAdminStore(db: Database = getDatabase()): AdminStore {
  return {
    async findUserByEmail(email) {
      const record = await db.adminUser.findUnique({
        where: { email }, select: { id: true, email: true, passwordHash: true, role: true, active: true },
      });
      return record ? toAdminAccount(record) : null;
    },
    async createSession(tokenHash, adminId, expiresAt) {
      await db.adminSession.create({ data: { tokenHash, adminId, expiresAt } });
    },
    async findSession(tokenHash, now) {
      const record = await db.adminSession.findFirst({
        where: { tokenHash, revokedAt: null, expiresAt: { gt: now }, admin: { active: true } },
        select: {
          id: true, expiresAt: true,
          admin: { select: { id: true, email: true, role: true, active: true } },
        },
      });
      if (!record) return null;
      return { ...record, admin: { ...record.admin, role: record.admin.role as AdminActor["role"] } };
    },
    async revokeSession(tokenHash, now) {
      await db.adminSession.updateMany({ where: { tokenHash, revokedAt: null }, data: { revokedAt: now } });
    },
    async audit(input) {
      await db.adminAuditLog.create({ data: {
        adminId: input.adminId, action: input.action, entityType: input.entityType,
        entityId: input.entityId ?? null,
      } });
    },
    async summary() {
      const [inquiries, partnerships, editorialDrafts, editorialPublished] = await Promise.all([
        db.inquirySubmission.count(),
        db.partnershipSubmission.count(),
        db.editorialEntry.count({ where: { status: EditorialStatus.DRAFT } }),
        db.editorialEntry.count({ where: { status: EditorialStatus.PUBLISHED } }),
      ]);
      return { inquiries, partnerships, editorialDrafts, editorialPublished };
    },
    async listLeads(kind, page, limit, status) {
      const skip = (page - 1) * limit;
      if (kind === "inquiry") {
        const where = status ? { status: status as SubmissionStatus } : {};
        const [items, total] = await Promise.all([
          db.inquirySubmission.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
          db.inquirySubmission.count({ where }),
        ]);
        return { page, limit, total, items: items as unknown as Record<string, unknown>[] };
      }
      const where = status ? { status: status as SubmissionStatus } : {};
      const [items, total] = await Promise.all([
        db.partnershipSubmission.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
        db.partnershipSubmission.count({ where }),
      ]);
      return { page, limit, total, items: items as unknown as Record<string, unknown>[] };
    },
    async updateLead(kind, id, status, internalNote, actor) {
      await db.$transaction(async (tx) => {
        if (kind === "inquiry") {
          await tx.inquirySubmission.update({
            where: { id }, data: { status: status as SubmissionStatus, internalNote },
          });
        } else {
          await tx.partnershipSubmission.update({
            where: { id }, data: { status: status as SubmissionStatus, internalNote },
          });
        }
        await tx.adminAuditLog.create({ data: {
          adminId: actor.id, action: "lead.updated", entityType: kind, entityId: id,
        } });
      });
    },
    async listEditorial(kind) {
      const items = await db.editorialEntry.findMany({
        where: kind ? { kind: kind as EditorialKind } : {},
        orderBy: [{ updatedAt: "desc" }, { title: "asc" }],
      });
      return items.map(toEditorial);
    },
    async upsertEditorial(input, actor) {
      return db.$transaction(async (tx) => {
        const where = { kind_slug: { kind: input.kind as EditorialKind, slug: input.slug } };
        const existing = await tx.editorialEntry.findUnique({ where });
        const publishedAt = input.status === "PUBLISHED"
          ? existing?.publishedAt ?? new Date()
          : null;
        const data = {
          title: input.title, category: input.category, summary: input.summary, artwork: input.artwork,
          caption: input.caption ?? null, topics: input.topics, outline: input.outline, body: input.body,
          audioUrl: input.audioUrl ?? null, durationSeconds: input.durationSeconds ?? null,
          transcript: input.transcript ?? null, author: input.author ?? null,
          status: input.status as EditorialStatus, publishedAt, editedById: actor.id,
        };
        const item = await tx.editorialEntry.upsert({
          where,
          create: { ...data, kind: input.kind as EditorialKind, slug: input.slug },
          update: data,
        });
        await tx.adminAuditLog.create({ data: {
          adminId: actor.id, action: "editorial.saved", entityType: input.kind.toLowerCase(), entityId: item.id,
        } });
        return toEditorial(item);
      });
    },
    async listPublishedEditorial(kind) {
      const items = await db.editorialEntry.findMany({
        where: { kind, status: EditorialStatus.PUBLISHED, publishedAt: { not: null } },
        orderBy: [{ publishedAt: "desc" }, { title: "asc" }],
      });
      return items.map(toEditorial);
    },
    async findPublishedEditorial(kind, slug) {
      const item = await db.editorialEntry.findFirst({
        where: { kind, slug, status: EditorialStatus.PUBLISHED, publishedAt: { not: null } },
      });
      return item ? toEditorial(item) : null;
    },
  };
}
