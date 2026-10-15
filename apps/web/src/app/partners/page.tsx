import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/ui/primitives";
import { CTASection, PartnerCards } from "@/components/sections/shared";
export const metadata: Metadata = {
  title: "Partner With Us",
  description: "Explore college and franchise partnerships with MOUNDWEB.",
};
export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner with us"
        title={
          <>
            Shared ambition.
            <br />
            <em>Bigger possibilities.</em>
          </>
        }
        description="Connect learning, brands, and opportunity through thoughtful collaboration."
        image="about-world"
      />
      <Section>
        <SectionHeading
          eyebrow="Choose your direction"
          title={
            <>
              Let’s build something
              <br />
              <em>worth growing.</em>
            </>
          }
          description="Explore our partnership frameworks. Availability and terms are subject to confirmation."
        />
        <PartnerCards />
      </Section>
      <CTASection />
    </>
  );
}
