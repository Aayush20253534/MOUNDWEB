import type { Inquiry } from "./inquiry";
import type { PartnershipDraft } from "./partnership-inquiry";

type Status = { enabled: boolean; noticeVersion: string | null };
type Receipt = { receipt: string; status: "received"; duplicate: boolean };
export type SubmissionValue =
  | { kind: "contact"; data: Inquiry }
  | { kind: "partnership"; data: PartnershipDraft };

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export function submissionEndpoint() {
  if (process.env.NEXT_PUBLIC_SUBMISSIONS_ENABLED !== "true" || !baseUrl) return undefined;
  try {
    const url = new URL(baseUrl);
    if (url.username || url.password || url.search || url.hash || url.pathname !== "/") return undefined;
    if (url.protocol !== "https:" && !(url.protocol === "http:" &&
       (url.hostname === "localhost" || url.hostname === "127.0.0.1"))) return undefined;
    return url.origin;
  } catch { return undefined; }
}
export async function submissionStatus(): Promise<Status> {
  const base = submissionEndpoint();
  if (!base) return { enabled: false, noticeVersion: null };
  try {
    const response = await fetch(base + "/api/submission-status", { cache: "no-store" });
    if (!response.ok) return { enabled: false, noticeVersion: null };
    const data: Status = await response.json();
    return data.enabled && data.noticeVersion
      ? { enabled: true, noticeVersion: data.noticeVersion }
      : { enabled: false, noticeVersion: null };
  } catch { return { enabled: false, noticeVersion: null }; }
}
export async function submitInquiry(
  value: SubmissionValue, version: string, requestId: string,
): Promise<Receipt> {
  const base = submissionEndpoint();
  if (!base) throw new Error("Live submission is not configured.");
  const payload = value.kind === "contact"
    ? { ...value.data, requestId, consent: true, noticeVersion: version }
    : {
        kind: value.data.kind, name: value.data.name, email: value.data.email,
        phone: value.data.phone, organization: value.data.organization,
        role: value.data.role, location: value.data.location,
        interest: value.data.interest, message: value.data.message,
        requestId, consent: true, noticeVersion: version,
      };
  const route = value.kind === "contact" ? "/api/v1/inquiries" : "/api/v1/partnerships";
  const result = await fetch(base + route, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), cache: "no-store",
  });
  if (!result.ok) throw new Error(
    result.status === 429 ? "Too many requests. Please wait and retry." :
    result.status === 409 ? "The privacy notice has changed. Reload this page to review it." :
    "The inquiry could not be accepted. Please try again."
  );
  const data = await result.json() as Receipt;
  if (!data.receipt || data.status !== "received") throw new Error("Unexpected response from submission service.");
  return data;
}
