# MOUNDWEB SEO runbook

Production canonical hostname: **https://www.moundweb.tech**. Do not use Vercel preview aliases in canonical tags, sitemaps or indexing requests.

## Implemented
- Unique page titles and descriptions, canonical URLs for indexable routes, Open Graph/Twitter previews.
- Organization and WebSite structured data with owner-confirmed Instagram/Facebook profiles, but no invented physical address.
- Service and breadcrumb structured data on service pages.
- Local/national/global SEO content on the search optimization service page.
- Dynamic `sitemap.xml` of public routes, legitimate learning paths, and **only** approved published editorial content. No fabricated last-modified timestamps.
- Public `robots.txt` pointing at the single canonical sitemap and disallowing administrative/API routes.
- Noindex for admin, legal placeholders, future offers, unverified job/placement pages, and unpublished editorial concepts.

## Launch and ongoing tasks that require business credentials
1. Check DNS and Vercel access settings: the public custom domain must not require SSO or a password. Verify apex redirects to www.
2. In Google Search Console add and verify the domain property with DNS, submit `https://www.moundweb.tech/sitemap.xml`, and run URL Inspection for home/services/content routes. Submit to Bing Webmaster Tools.
3. Check indexability, canonical consistency, content rendering, HTTP responses, mobile usability and Core Web Vitals in production.
4. Get the *actual* MOUNDWEB street address or real service-area identity, phone, operating hours, city and business category confirmed before adding LocalBusiness structured data. Create/verify the Google Business Profile only if eligible.
5. Add genuine work examples, honest reviews with consent, useful local content for *actual* service areas, editorial articles and credible citations. Never create doorway-style city pages.
6. If real translated international pages are published, add hreflang then. Do not assert overseas offices, clients or guaranteed rankings.
7. Publish approved privacy/terms content before enabling contact submissions.

Technical changes improve crawlability but cannot guarantee Google indexing, local pack eligibility, or any ranking position.
