import { Prisma } from "./generated/prisma/client.js";
import { Resend } from "resend";
import { getDatabase } from "./database.js";
import type { ContactPayload, PartnershipPayload } from "./submission-schemas.js";

export interface SubmissionStore {
  saveContact(data: ContactPayload): Promise<{ id: string; duplicate: boolean }>;
  savePartnership(data: PartnershipPayload): Promise<{ id: string; duplicate: boolean }>;
  setContactEmailStatus(id: string, status: string): Promise<void>;
  setPartnershipEmailStatus(id: string, status: string): Promise<void>;
}
export interface NotificationSender {
  sendContact(data: ContactPayload): Promise<void>;
  sendPartnership(data: PartnershipPayload): Promise<void>;
}

function prisma() { return getDatabase(); }
function duplicateKey(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
export function createPrismaStore(): SubmissionStore {
  return {
    async saveContact(data) {
      try {
        const item = await prisma().inquirySubmission.create({ data: {
          requestId: data.requestId, category: data.type, name: data.name,
          email: data.email, phone: data.phone || null, subject: data.subject,
          message: data.message, consentVersion: data.noticeVersion,
        } });
        return { id: item.id, duplicate: false };
      } catch (error) {
        if (!duplicateKey(error)) throw error;
        const existing = await prisma().inquirySubmission.findUnique({ where: { requestId: data.requestId } });
        if (!existing) throw error;
        return { id: existing.id, duplicate: true };
      }
    },
    async savePartnership(data) {
      try {
        const item = await prisma().partnershipSubmission.create({ data: {
          requestId: data.requestId, kind: data.kind, name: data.name, email: data.email,
          phone: data.phone || null, organization: data.organization, role: data.role,
          location: data.location, interest: data.interest, message: data.message,
          consentVersion: data.noticeVersion,
        } });
        return { id: item.id, duplicate: false };
      } catch (error) {
        if (!duplicateKey(error)) throw error;
        const existing = await prisma().partnershipSubmission.findUnique({ where: { requestId: data.requestId } });
        if (!existing) throw error;
        return { id: existing.id, duplicate: true };
      }
    },
    async setContactEmailStatus(id, emailStatus) {
      await prisma().inquirySubmission.update({ where: { id }, data: { emailStatus } });
    },
    async setPartnershipEmailStatus(id, emailStatus) {
      await prisma().partnershipSubmission.update({ where: { id }, data: { emailStatus } });
    },
  };
}
function senderConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_TO_EMAIL;
  if (!apiKey || !from || !to) throw new Error("Resend notification configuration incomplete");
  return { client: new Resend(apiKey), from, to };
}
async function sendText(subject: string, text: string, replyTo: string) {
  const { client, from, to } = senderConfig();
  const result = await client.emails.send({ from, to: [to], subject, text, replyTo });
  if (result.error) throw new Error("Resend rejected the notification");
}
export function createResendSender(): NotificationSender {
  return {
    sendContact: (data) => sendText(
      "MOUNDWEB inquiry received: " + data.type,
      ["New contact inquiry", "Name: " + data.name, "Email: " + data.email,
        "Phone: " + data.phone, "Type: " + data.type, "Subject: " + data.subject,
        "", data.message].join("\n"),
      data.email,
    ),
    sendPartnership: (data) => sendText(
      "MOUNDWEB partnership inquiry: " + data.kind,
      ["New partnership inquiry", "Contact: " + data.name, "Email: " + data.email,
        "Phone: " + data.phone, "Kind: " + data.kind,
        "Organization: " + data.organization, "Role: " + data.role,
        "Location: " + data.location, "Interest: " + data.interest,
        "", data.message].join("\n"),
      data.email,
    ),
  };
}
