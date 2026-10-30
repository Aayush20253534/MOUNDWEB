import type { MetadataRoute } from "next";
import { courses, services } from "@/lib/content";
import { getPublicEditorialLists } from "@/lib/editorial-remote";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Avoid draft, private and noindex URLs. Do not fabricate lastmod timestamps.
  const routes = [
    "/", "/about", "/services", "/programs", "/contact", "/partners",
    "/partners/colleges", "/partners/franchise",
    ...services.map((service) => "/services/" + service.slug),
    ...courses.map((course) => "/programs/" + course.slug),
  ];
  const published = await getPublicEditorialLists();
  if (published.podcast.length) {
    routes.push("/podcast", ...published.podcast.map((item) => "/podcast/" + item.slug));
  }
  if (published.media.length) {
    routes.push("/media", ...published.media.map((item) => "/media/" + item.slug));
  }
  return [...new Set(routes)].map((route) => ({ url: absoluteUrl(route) }));
}
