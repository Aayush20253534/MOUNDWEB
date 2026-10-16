import type { Metadata } from "next";
import Image from "next/image";
import { Clock3, Orbit, Sparkles } from "lucide-react";
import { Breadcrumbs, ButtonLink, Container, Eyebrow, Section } from "@/components/ui/primitives";
import { ServiceMotion } from "@/components/services/service-motion";

export const metadata: Metadata = {
  title: "Advertising | Coming Soon",
  description: "MOUNDWEB's upcoming Advertising offering is being developed. Explore our current digital marketing and brand growth services.",
};

export default function AdvertisingComingSoon() {
  return (
    <>
      <ServiceMotion />
      <Container>
        <Breadcrumbs items={[{ label: "Our Services", href: "/services" }, { label: "Advertising: Coming Soon" }]} />
      </Container>
      <section className="advertising-coming-hero" aria-labelledby="advertising-coming-title">
        <Image src="/assets/landscapes/mountain-panorama.webp"
          alt="" fill priority sizes="100vw" />
        <div className="advertising-coming-shade" />
        <Container className="advertising-coming-content">
          <div className="service-reveal">
            <Eyebrow>The next horizon / MOUNDWEB</Eyebrow>
            <span className="advertising-coming-status"><Clock3 size={17} aria-hidden="true" /> Coming Soon</span>
            <h1 id="advertising-coming-title">
              Something powerful <em>is taking shape.</em>
            </h1>
            <p>
              We are developing a dedicated Advertising offering within the MOUNDWEB growth ecosystem.
              It is not available to book today, and no launch date has been announced.
            </p>
            <div className="advertising-coming-actions">
              <ButtonLink href="/services">Explore current services</ButtonLink>
              <ButtonLink href="/contact?type=growth&subject=Advertising%20information#inquiry" variant="secondary">
                Ask a question
              </ButtonLink>
            </div>
            <p className="advertising-coming-fineprint">
              Current Performance Marketing includes paid campaign strategy. This future Advertising offering is separate and not yet available.
              The contact inquiry is a local preview until message delivery is enabled.
            </p>
          </div>
          <div className="advertising-coming-orbit" aria-hidden="true">
            <div className="advertising-coming-ring advertising-coming-ring--one" />
            <div className="advertising-coming-ring advertising-coming-ring--two" />
            <div className="advertising-coming-ring advertising-coming-ring--three" />
            <span className="advertising-coming-core"><Orbit size={50} strokeWidth={1.3}/></span>
            <i className="advertising-coming-spark advertising-coming-spark--one" />
            <i className="advertising-coming-spark advertising-coming-spark--two" />
            <i className="advertising-coming-spark advertising-coming-spark--three" />
          </div>
        </Container>
      </section>
      <Section className="advertising-coming-next service-reveal">
        <div className="advertising-coming-next-grid">
          <article>
            <Sparkles size={25} aria-hidden="true" />
            <h2>Growth is already in motion.</h2>
            <p>Explore the marketing services available now, including SEO, social media, performance marketing, branding, creative content and strategy.</p>
          </article>
          <div>
            <Eyebrow>Explore our work</Eyebrow>
            <h3>Today’s focus. <em>Tomorrow’s possibilities.</em></h3>
            <ButtonLink href="/services#service-explorer" variant="secondary">
              Discover your next step
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
