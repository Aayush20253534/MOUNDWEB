import type { MetadataRoute } from "next";
import { courses, services } from "@/lib/content";
import { getPublicEditorialLists } from "@/lib/editorial-remote";

export const dynamic = "force-dynamic";
function publicOrigin() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) return undefined;
    if (url.username || url.password || url.search || url.hash || url.pathname !== "/") return undefined;
    return url.origin;
  } catch { return undefined; }
}
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicOrigin();
  if (!base) return [];
  const paths = [
    "/", "/about", "/services", "/programs", "/contact", "/partners",
    "/partners/colleges", "/partners/franchise",
    ...services.map((service) => "/services/" + service.slug),
    "/services/advertising-coming-soon",
    ...courses.map((course) => "/programs/" + course.slug),
  ];
  const editorial = await getPublicEditorialLists();
  paths.push(
    ...editorial.podcast.map((item) => "/podcast/" + item.slug),
    ...editorial.media.map((item) => "/media/" + item.slug),
  );
  return [...new Set(paths)].map((route) => ({ url: base + route }));
}
