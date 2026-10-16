import { z } from "zod";

const requiredText = (min: number, max: number) =>
  z.string().trim().min(min).max(max);
const name = requiredText(2, 100);
const email = z.string().trim().email().max(254);
const phone = z.string().trim().max(24).refine((value) =>
  !value || (/^[+\d\s().-]+$/.test(value) && value.replace(/\D/g, "").length >= 7 &&
    value.replace(/\D/g, "").length <= 15), "Invalid phone number");
const shared = {
  requestId: z.string().uuid(),
  name,
  email,
  phone: phone.default(""),
  message: requiredText(20, 3000),
  consent: z.literal(true),
  noticeVersion: requiredText(1, 50),
  website: z.string().max(0).optional(), // Honeypot
};
export const contactSchema = z.object({
  ...shared,
  type: z.enum(["growth", "course", "college", "franchise", "career", "media", "other"]),
  subject: requiredText(3, 160),
}).strict();

export const partnershipSchema = z.object({
  ...shared,
  kind: z.enum(["colleges", "franchise"]),
  organization: requiredText(2, 140),
  role: requiredText(2, 90),
  location: requiredText(2, 120),
  interest: z.string().max(50),
}).strict().superRefine((data, ctx) => {
  const allowed = data.kind === "colleges"
    ? ["workshops", "programs", "career", "other"]
    : ["learning-center", "market", "model", "other"];
  if (!allowed.includes(data.interest))
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["interest"], message: "Choose a valid partnership interest." });
});

export type ContactPayload = z.infer<typeof contactSchema>;
export type PartnershipPayload = z.infer<typeof partnershipSchema>;
