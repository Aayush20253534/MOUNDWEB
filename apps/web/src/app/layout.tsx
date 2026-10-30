import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SiteMotion } from "@/components/layout/site-motion";
import { socialProfiles } from "@/lib/social-profiles";
import { SITE_ORIGIN, SITE_DESCRIPTION, organizationGraph, jsonLd } from "@/lib/seo";
import "./globals.css";

const inter = localFont({
  src: "../../public/fonts/inter-latin-variable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});
const manrope = localFont({
  src: "../../public/fonts/manrope-latin-variable.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070707",
};
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: "MOUNDWEB",
  title: { default: "Digital Marketing, SEO & Creative Growth | MOUNDWEB", template: "%s | MOUNDWEB" },
  description: SITE_DESCRIPTION,
  keywords: ["digital marketing agency", "SEO services India", "local SEO", "social media marketing", "performance marketing", "brand strategy", "digital marketing courses", "web development learning"],
  openGraph: {
    type: "website",
    siteName: "MOUNDWEB",
    locale: "en_IN",
    title: "Digital Marketing, SEO & Creative Growth | MOUNDWEB",
    description: SITE_DESCRIPTION,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "MOUNDWEB digital marketing and SEO" }],
  },
  twitter: { card: "summary_large_image", title: "Digital Marketing, SEO & Creative Growth | MOUNDWEB", description: SITE_DESCRIPTION, images: ["/opengraph-image"] },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1, "max-snippet": -1 },
  },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }], apple: "/apple-touch-icon.png" },
  manifest: "/manifest.webmanifest",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const sameAs = socialProfiles
    .map((profile) => profile.url)
    .filter((url): url is `https://${string}` => url !== null);
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(organizationGraph(sameAs)) }} />
        <SiteMotion />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
