import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { ContactHero } from "@/components/contact/contact-hero";
import {
  Eyebrow,
  Section,
  SectionHeading,
  IconTile,
  Skeleton,
  FeaturePanel,
} from "@/components/ui/primitives";
import { Accordion } from "@/components/ui/accordion";
import {
  CapabilityStrip,
  CTASection,
  PartnerCards,
} from "@/components/sections/shared";
import { OrbitGlobeStage } from "@/components/scenes/scene-stages";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { contactFaqs } from "@/lib/content";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ConnectionMotion } from "@/components/scenes/connection-motion";
import { SocialLinks } from "@/components/ui/social-links";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact Us",
  description:
    "Explore marketing, training, college partnerships, franchise opportunities, and careers with MOUNDWEB.",
};
export default function ContactPage() {
  return (
    <>
      <ConnectionMotion />
      <ContactHero />
      <CapabilityStrip />
      <Section className="connection-reveal">
        <SectionHeading
          eyebrow="Get in touch"
          title={
            <>
              Different ways to <em>connect.</em>
            </>
          }
          description="We’re preparing our contact channels. Confirmed details will be published here."
        />
        <div className="contact-method-grid">
          {[
            {
              icon: "mail" as const,
              title: "Email us",
              text: "For questions, ideas, and opportunities.",
              value: "Email to be confirmed",
            },
            {
              icon: "phone" as const,
              title: "Call us",
              text: "A direct conversation with the team.",
              value: "Phone to be confirmed",
            },
            {
              icon: "pin" as const,
              title: "Visit us",
              text: "Meet us when location details are live.",
              value: "Address to be confirmed",
            },
            {
              icon: "clock" as const,
              title: "Office hours",
              text: "Find a time that works for everyone.",
              value: "Hours to be confirmed",
            },
          ].map((item) => (
            <article className="contact-method" key={item.title}>
              <IconTile name={item.icon} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span>{item.value}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="contact-social">
          <h3>Connect with us online</h3>
          <SocialLinks variant="labeled" />
        </div>
      </Section>
      <Section id="conversation-paths" className="connection-pathways connection-reveal">
        <SectionHeading
          eyebrow="Choose a conversation"
          title={<>What brings you <em>here?</em></>}
          description="Start with the right context. College and franchise opportunities have dedicated inquiry preparation."
        />
        <div className="connection-path-grid">
          {[
            { icon: "chart" as const, title: "Brand growth", description: "SEO, social media, performance and creative strategy.", href: "/contact?type=growth&subject=Brand%20growth%20consultation#inquiry", label: "Prepare marketing inquiry" },
            { icon: "cap" as const, title: "Learning guidance", description: "Explore programs, suitability and course information.", href: "/contact?type=course&subject=Program%20guidance#inquiry", label: "Prepare program inquiry" },
            { icon: "building" as const, title: "College partnership", description: "Structured discussion for institutions and colleges.", href: "/partners/colleges#partnership-inquiry", label: "Explore college inquiry" },
            { icon: "handshake" as const, title: "Franchise partnership", description: "Explore a proposed learning or business partnership.", href: "/partners/franchise#partnership-inquiry", label: "Explore franchise inquiry" },
          ].map((path) => (
            <Link href={path.href} className="connection-path-card" key={path.title}>
              <IconTile name={path.icon} />
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <span>{path.label}<ArrowRight size={16} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </Section>
      <Section id="inquiry" className="inquiry-section connection-reveal">
        <div className="inquiry-panel">
          <div className="inquiry-intro">
            <Eyebrow>Your next step</Eyebrow>
            <h2>
              Tell us about
              <br />
              your <em>inquiry.</em>
            </h2>
            <p>
              Whether it’s digital growth, a learning path, a college
              partnership, or a bigger idea, start by telling us what matters to
              you.
            </p>
            <OrbitGlobeStage compact />
          </div>
          <div className="inquiry-form-wrap">
            <Suspense
              fallback={
                <div role="status" aria-label="Loading inquiry form">
                  <Skeleton className="form-skeleton" />
                </div>
              }
            >
              <InquiryForm />
            </Suspense>
          </div>
          <aside className="inquiry-art">
            <Image
              src="/assets/partnerships/contact-network.webp"
              alt="An illuminated path connects distant mountain peaks"
              fill
              sizes="25vw"
            />
            <div>
              <p>
                Ideas
                <br />
                Partnerships
                <br />
                People
                <br />
                <strong>Real possibility.</strong>
              </p>
              <span>
                Different goals.
                <br />
                One shared vision.
              </span>
            </div>
          </aside>
        </div>
      </Section>
      <Section className="connection-reveal">
        <SectionHeading
          eyebrow="Why reach out"
          title={
            <>
              How we can <em>help.</em>
            </>
          }
          description="Find a starting point for your next conversation."
        />
        <div className="card-grid help-grid">
          <FeaturePanel icon="chart" title="Growth consultation">
            Explore digital marketing, brand strategy, and your next move.
          </FeaturePanel>
          <FeaturePanel icon="cap" title="Program guidance">
            Understand our learning paths and proposed programs.
          </FeaturePanel>
          <FeaturePanel icon="handshake" title="Partnership opportunities">
            Explore collaboration for colleges and franchise partners.
          </FeaturePanel>
          <FeaturePanel icon="users" title="Career conversations">
            Learn about the kind of work we’re building together.
          </FeaturePanel>
        </div>
      </Section>
      <Section className="connection-reveal">
        <SectionHeading
          eyebrow="Partner with us"
          title={
            <>
              Let’s grow <em>together.</em>
            </>
          }
          description="Bring a shared ambition. Explore what we could build together."
        />
        <PartnerCards />
      </Section>
      <Section className="connection-reveal">
        <div className="split-layout faq-layout">
          <div>
            <Eyebrow>Frequently asked questions</Eyebrow>
            <h2>
              Quick answers
              <br />
              to <em>common questions.</em>
            </h2>
            <p className="body-copy">
              A few things to know before you get started.
            </p>
          </div>
          <Accordion items={contactFaqs} />
        </div>
      </Section>
      <CTASection
        eyebrow="Let’s create impact"
        title={
          <>
            Ready to build
            <br />
            <em>something bigger?</em>
          </>
        }
        description="Your next chapter starts with an idea. Put it into words."
        primaryLabel="Prepare your inquiry"
        href="#inquiry"
      />
    </>
  );
}
