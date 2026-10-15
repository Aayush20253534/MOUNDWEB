import type { MetadataRoute } from "next";
import { courses } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    "/",
    "/about",
    "/services",
    "/programs",
    "/contact",
    "/partners",
    "/partners/colleges",
    "/partners/franchise",
    ...courses.map((course) => `/programs/${course.slug}`),
  ].map((route) => ({ url: `${base.replace(/\/$/, "")}${route}` }));
}
