"use client";

import { usePathname } from "next/navigation";
import { CTASection } from "@/components/sections/shared";

/**
 * The homepage's city-growth CTA is the single footer-adjacent banner on
 * every public route. Keep it outside individual pages so content order,
 * artwork and action never drift. Internal consoles are intentionally exempt.
 */
export function SiteFooterCTA() {
  const pathname = usePathname();
  if (
    pathname === "/admin" ||
    pathname?.startsWith("/admin/") ||
    pathname === "/design-system" ||
    pathname?.startsWith("/design-system/")
  ) {
    return null;
  }

  return (
    <CTASection
      cityBackdrop
      title={
        <>
          Ready to <em>grow</em>
          <br />
          your brand?
        </>
      }
      description="Let’s explore a focused strategy for your brand’s next chapter."
      primaryLabel="Start a project"
      href="/contact?type=growth#inquiry"
    />
  );
}
