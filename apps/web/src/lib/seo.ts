/** Verified MOUNDWEB production domain. Change only after validating a new canonical domain. */
export const SITE_ORIGIN = "https://www.moundweb.tech";
export const SITE_DESCRIPTION =
  "Digital marketing, SEO, social media, performance campaigns and creative strategy for brands in India and online markets, alongside digital skills learning paths.";

export function absoluteUrl(path: string = "/"): string {
  if (!path.startsWith("/") || path.startsWith("//"))
    throw new Error("SEO paths must be local absolute paths");
  return new URL(path, SITE_ORIGIN).toString();
}

export function organizationGraph(sameAs: readonly string[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: "MOUNDWEB",
        url: absoluteUrl("/"),
        logo: absoluteUrl("/icon.svg"),
        description: SITE_DESCRIPTION,
        ...(sameAs.length ? { sameAs: [...sameAs] } : {}),
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: "MOUNDWEB",
        url: absoluteUrl("/"),
        inLanguage: "en-IN",
        publisher: { "@id": absoluteUrl("/#organization") },
      },
    ],
  };
}
export function serviceGraph(service: {slug: string; title: string; summary: string}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl("/services/" + service.slug + "#service"),
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    url: absoluteUrl("/services/" + service.slug),
    provider: { "@id": absoluteUrl("/#organization") },
  };
}
export function breadcrumbGraph(items: readonly {name: string; path: string}[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, String.fromCharCode(92) + "u003c");
}
