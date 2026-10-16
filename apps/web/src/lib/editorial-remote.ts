import {
  isPublishedEpisode, isPublishedMedia, safeMediaSource,
  type Episode, type MediaItem,
} from "./editorial";

export type PublishedEditorial = Episode | MediaItem;
export function editorialApiBase(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.username || url.password || url.search || url.hash || url.pathname !== "/") return undefined;
    if (url.protocol !== "https:" &&
      !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) return undefined;
    return url.origin;
  } catch { return undefined; }
}
function validCommon(item: Record<string, unknown>) {
  return typeof item.slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) &&
    typeof item.title === "string" && item.title.length > 0 &&
    typeof item.summary === "string" && item.summary.length > 0 &&
    typeof item.artwork === "string" && item.artwork.startsWith("/assets/") &&
    !item.artwork.includes("..") && item.status === "published" &&
    typeof item.publishedAt === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.publishedAt);
}
export function normalizePublishedEditorial(value: unknown, kind: "podcast" | "media"): PublishedEditorial | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const item = value as Record<string, unknown>;
  if (!validCommon(item) || !Array.isArray(item.outline) ||
      !item.outline.every((part) => typeof part === "string" && part.trim())) return undefined;
  if (kind === "podcast") {
    if (!["Brand Growth", "Creative Thinking", "Digital Learning"].includes(String(item.category)) ||
        !Array.isArray(item.topics) || !item.topics.every((part) => typeof part === "string") ||
        typeof item.audioSrc !== "string" || !safeMediaSource(item.audioSrc) ||
        typeof item.transcript !== "string" || !item.transcript.trim() ||
        typeof item.durationSeconds !== "number" || !Number.isSafeInteger(item.durationSeconds) || item.durationSeconds < 1) return undefined;
    const episode: Episode = {
      slug: item.slug as string, title: item.title as string, summary: item.summary as string,
      category: item.category as Episode["category"], status: "published",
      artwork: item.artwork as string, topics: item.topics as string[],
      outline: item.outline as string[], publishedAt: item.publishedAt as string,
      audioSrc: item.audioSrc as string, transcript: item.transcript as string,
      durationSeconds: item.durationSeconds as number,
    };
    return isPublishedEpisode(episode) ? episode : undefined;
  }
  if (!["Perspectives", "Learning", "Studio Notes"].includes(String(item.category)) ||
      typeof item.author !== "string" || !item.author.trim() ||
      !Array.isArray(item.body) || item.body.length === 0 ||
      !item.body.every((part) => typeof part === "string" && part.trim())) return undefined;
  const media: MediaItem = {
    slug: item.slug as string, title: item.title as string, summary: item.summary as string,
    category: item.category as MediaItem["category"], status: "published",
    artwork: item.artwork as string, caption: typeof item.caption === "string" ? item.caption : "",
    outline: item.outline as string[], publishedAt: item.publishedAt as string,
    body: item.body as string[], author: item.author as string,
  };
  return isPublishedMedia(media) ? media : undefined;
}
async function fetchEditorial(kind: "podcast" | "media", slug?: string): Promise<PublishedEditorial[]> {
  const base = editorialApiBase();
  if (!base) return [];
  try {
    const url = base + "/api/v1/editorial/" + kind + (slug ? "/" + encodeURIComponent(slug) : "");
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(2500) });
    if (!response.ok) return [];
    const raw: unknown = await response.json();
    if (slug) {
      const item = normalizePublishedEditorial(raw, kind);
      return item ? [item] : [];
    }
    if (!raw || typeof raw !== "object" || !Array.isArray((raw as { items?: unknown }).items)) return [];
    return ((raw as { items: unknown[] }).items)
      .map((item) => normalizePublishedEditorial(item, kind))
      .filter((item): item is PublishedEditorial => Boolean(item));
  } catch {
    return [];
  }
}
export async function getPublishedEpisode(slug: string): Promise<Episode | undefined> {
  return (await fetchEditorial("podcast", slug)).find((item): item is Episode => "topics" in item && item.slug === slug);
}
export async function getPublishedMedia(slug: string): Promise<MediaItem | undefined> {
  return (await fetchEditorial("media", slug)).find((item): item is MediaItem => "body" in item && item.slug === slug);
}
export async function getPublicEditorialLists(): Promise<{ podcast: Episode[]; media: MediaItem[] }> {
  const [podcast, media] = await Promise.all([fetchEditorial("podcast"), fetchEditorial("media")]);
  return {
    podcast: podcast.filter((item): item is Episode => "topics" in item),
    media: media.filter((item): item is MediaItem => "body" in item),
  };
}

export async function getPublishedItems(kind: "podcast" | "media"): Promise<PublishedEditorial[]> {
  return fetchEditorial(kind);
}
