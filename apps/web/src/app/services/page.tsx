import type { Metadata } from "next";
import Image from "next/image";
import { services } from "@/lib/content";
import { ServicesHero } from "@/components/services/services-hero";
import {
  ButtonLink,
  Section,
  SectionHeading,
  Eyebrow,
  FeaturePanel,
  Badge,
} from "@/components/ui/primitives";
import { ServiceCard } from "@/components/ui/cards";
import {
  CapabilityStrip,
  CTASection,
  MeasurementPanel,
  ProcessSteps,
} from "@/components/sections/shared";
import { ServiceMotion } from "@/components/services/service-motion";
import { ServiceExplorer } from "@/components/services/service-explorer";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "Our Services",
  description:
    "Explore MOUNDWEB digital marketing, SEO, social media, performance, creative, branding, and growth strategy services.",
};
export default function ServicesPage() {
  return (
    <>
      <ServiceMotion />
      <ServicesHero />
      <CapabilityStrip />
      <Section id="growth-services" className="service-reveal">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Our digital
              <br />
              <em>growth services.</em>
            </>
          }
          description="A connected set of marketing services, built around your brand, your audience, and your priorities."
        />
        <div className="card-grid services-full-grid">
          {services.map((service) => (
            <ServiceCard service={service} key={service.slug} />
          ))}
        </div>
      </Section>
      <Section id="service-explorer" className="service-explorer-section service-reveal">
        <ServiceExplorer />
      </Section>
      <Section className="service-reveal">
        <div className="advertising-banner advertising-banner--interactive" id="advertising">
          <Image
            src="/assets/landscapes/mountain-panorama.webp"
            alt=""
            fill
            sizes="100vw"
          />
          <div className="advertising-banner-copy">
            <Eyebrow>The next horizon</Eyebrow>
            <h2>Advertising services</h2>
            <p>A dedicated offering is taking shape. Explore the preview.</p>
            <ButtonLink href="/services/advertising-coming-soon" size="small" variant="secondary">
              Explore what’s coming
            </ButtonLink>
          </div>
          <Badge>Coming soon</Badge>
        </div>
      </Section>
      <Section className="why-section service-reveal">
        <div className="split-layout">
          <div>
            <Eyebrow>Why MOUNDWEB</Eyebrow>
            <h2>
              More than
              <br />
              <em>just a service.</em>
            </h2>
            <p className="body-copy">
              Bring strategy, creative thinking, and consistent execution into
              the same conversation.
            </p>
          </div>
          <div className="feature-grid">
            <FeaturePanel icon="target" title="Purposeful approach">
              Start with the goals that matter to your brand.
            </FeaturePanel>
            <FeaturePanel icon="users" title="Collaborative thinking">
              Build a shared understanding before execution.
            </FeaturePanel>
            <FeaturePanel icon="lightbulb" title="Considered strategies">
              A plan shaped around your context and audience.
            </FeaturePanel>
            <FeaturePanel icon="chart" title="Clear measurement">
              Make progress easier to understand and act on.
            </FeaturePanel>
          </div>
        </div>
      </Section>
      <Section id="process" className="process-section service-reveal">
        <div className="process-layout">
          <div>
            <Eyebrow>Our process</Eyebrow>
            <h2>
              From strategy
              <br />
              to <em>forward motion.</em>
            </h2>
            <p className="body-copy">
              A clear path from your first idea to your next decision.
            </p>
          </div>
          <ProcessSteps />
        </div>
      </Section>
      <div className="service-reveal">
        <MeasurementPanel compact />
      </div>
      <CTASection
        title={
          <>
            Let’s take your brand
            <br />
            to the <em>next level.</em>
          </>
        }
        description="Tell us where you are and where you want to go."
        primaryLabel="Start a project"
        href="/contact?type=growth#inquiry"
      />
    </>
  );
}
