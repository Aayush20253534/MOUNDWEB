export type AdminRole = "ADMIN" | "EDITOR";
export type AdminUser = { id: string; email: string; role: AdminRole };
export type AdminSummary = { inquiries?: number; partnerships?: number; editorialDrafts: number; editorialPublished: number };
export type LeadStatus = "NEW" | "IN_REVIEW" | "RESOLVED" | "ARCHIVED";
export type AdminLead = {
  id: string; name: string; email: string; phone?: string | null; status: LeadStatus;
  internalNote?: string | null; createdAt: string; message: string; emailStatus?: string;
  category?: string; subject?: string; kind?: string; organization?: string; role?: string;
  location?: string; interest?: string;
};
export type AdminEditorial = {
  id?: string; kind: "PODCAST" | "MEDIA"; slug: string; title: string; category: string;
  summary: string; artwork: string; caption?: string; topics: string[]; outline: string[];
  body: string[]; audioUrl?: string; durationSeconds?: number; transcript?: string;
  author?: string; status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: string | null; createdAt?: string; updatedAt?: string;
};
export class AdminApiError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}
export function adminApiBase(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.username || url.password || url.search || url.hash || url.pathname !== "/") return undefined;
    if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) return undefined;
    return url.origin;
  } catch { return undefined; }
}
export async function adminRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = adminApiBase();
  if (!base) throw new AdminApiError("Set NEXT_PUBLIC_API_BASE_URL to the deployed API origin before signing in.", 0);
  let response: Response;
  try {
    response = await fetch(base + path, {
      ...init, credentials: "include", cache: "no-store",
      headers: { ...(init.body ? { "Content-Type": "application/json" } : {}), ...(init.headers ?? {}) },
    });
  } catch {
    throw new AdminApiError("Cannot reach the API. Check the API URL, deployment status and CORS origins.", 0);
  }
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => ({})) as { error?: string };
  if (!response.ok) throw new AdminApiError(body.error || "The request failed.", response.status);
  return body as T;
}
