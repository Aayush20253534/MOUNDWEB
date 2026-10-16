import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PageHero } from "@/components/sections/page-hero";
import {
  Section,
  SectionHeading,
  ButtonLink,
  FeaturePanel,
  Badge,
} from "@/components/ui/primitives";
import { CTASection } from "@/components/sections/shared";
import { ConnectionMotion } from "@/components/scenes/connection-motion";
import { PartnershipForm } from "@/components/forms/partnership-form";
import { PartnershipProcess } from "@/components/partners/partnership-process";
import { Accordion } from "@/components/ui/accordion";
import { Eyebrow } from "@/components/ui/primitives";

const partners = {
  colleges: {
    title: "College Partnerships",
    headline: "Connect classrooms.",
    accent: "Open possibilities.",
    description:
      "A proposed framework for bringing practical digital learning and industry perspectives to your institution.",
    image: "college-partnership",
    type: "college",
    features: [
      {
        title: "Practical workshops",
        text: "Explore focused learning sessions in digital marketing and web development.",
      },
      {
        title: "Program collaboration",
        text: "Discuss a learning pathway shaped around your institution’s needs.",
      },
      {
        title: "Career perspective",
        text: "Explore how learning can connect with professional development.",
      },
      {
        title: "Shared planning",
        text: "Align on scope, delivery, supervision, and success measures.",
      },
    ],
  },
  franchise: {
    title: "Franchise Partnerships",
    headline: "Build a shared vision.",
    accent: "Grow with purpose.",
    description:
      "Explore the possibility of bringing MOUNDWEB’s learning and growth approach to a new community.",
    image: "franchise-partnership",
    type: "franchise",
    features: [
      {
        title: "A shared direction",
        text: "Discuss the audience, region, and learning opportunities you want to serve.",
      },
      {
        title: "Learning-led growth",
        text: "Explore a business concept built around useful digital skills.",
      },
      {
        title: "A clear framework",
        text: "Understand the proposed support model before making commitments.",
      },
      {
        title: "Thoughtful next steps",
        text: "Confirm eligibility, commercial terms, and availability with the team.",
      },
    ],
  },
};
type Kind = keyof typeof partners;
type Props = { params: Promise<{ kind: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(partners).map((kind) => ({ kind }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kind } = await params;
  return { title: partners[kind as Kind]?.title ?? "Partnerships" };
}
export default async function PartnershipPage({ params }: Props) {
  const { kind } = await params;
  const item = partners[kind as Kind];
  if (!item) notFound();
  return (
    <>
      <ConnectionMotion />
      <PageHero
        eyebrow={item.title}
        title={
          <>
            {item.headline}
            <br />
            <em>{item.accent}</em>
          </>
        }
        description={item.description}
        className="connection-hero"
      >
        <ButtonLink href="#partnership-inquiry">
          Explore a partnership
        </ButtonLink>
      </PageHero>
      <Section className="connection-reveal">
        <div className="split-layout">
          <div>
            <Image
              className="course-detail-image"
              src={`/assets/partnerships/${item.image}.webp`}
              width={960}
              height={640}
              alt="Architectural concept illustration; not an actual MOUNDWEB location"
            />
            <p className="micro-note">
              Conceptual illustration. This is not a photograph of a partner
              institution or office.
            </p>
          </div>
          <div>
            <SectionHeading
              eyebrow="A framework for collaboration"
              title={
                <>
                  Start with a<br />
                  <em>shared ambition.</em>
                </>
              }
            />
            <div className="feature-grid">
              {item.features.map((f, i) => (
                <FeaturePanel
                  key={f.title}
                  icon={
                    i === 0
                      ? "building"
                      : i === 1
                        ? "book"
                        : i === 2
                          ? "handshake"
                          : "target"
                  }
                  title={f.title}
                >
                  {f.text}
                </FeaturePanel>
              ))}
            </div>
          </div>
        </div>
      </Section>
      <PartnershipProcess kind={kind as Kind} />
      <Section className="partner-inquiry-section connection-reveal">
        <div className="partner-inquiry-layout">
          <div className="partner-inquiry-guidance">
            <Eyebrow>Explore a partnership</Eyebrow>
            <h2>Start with a <em>clear idea.</em></h2>
            <p>
              {kind === "colleges"
                ? "Tell us about your institution and the kind of learning collaboration you would like to explore."
                : "Share the region and business direction you would like to discuss. No franchise rights or returns are promised."}
            </p>
            <div className="partner-guidance-points">
              <span>01 / Prepare your details</span>
              <span>02 / Check a local preview</span>
              <span>03 / Copy your inquiry draft</span>
            </div>
            <p className="micro-note">
              Inquiries cannot be sent from this website yet. Message delivery and review will be implemented with the backend in Part 11.
            </p>
          </div>
          <PartnershipForm kind={kind as Kind} />
        </div>
      </Section>
      <Section className="partner-faq connection-reveal">
        <div className="split-layout faq-layout">
          <div>
            <Eyebrow>Before we collaborate</Eyebrow>
            <h2>Questions worth <em>asking.</em></h2>
            <p className="body-copy">Proposal details must be confirmed independently before any commitment.</p>
          </div>
          <Accordion items={kind === "colleges" ? [
            { question: "Is a college partnership confirmed by this form?", answer: "No. The form only prepares a draft. Availability, institutional permissions, scope and terms require independent agreement." },
            { question: "Are workshops and training programs already scheduled?", answer: "No schedule is guaranteed here. Timing, format, learner suitability, safeguarding and curriculum would be agreed with the institution." },
            { question: "How should we discuss student data?", answer: "Do not include student records or confidential information in the draft. Any future data processing requires an approved privacy and consent process." },
          ] : [
            { question: "Does sending an inquiry grant franchise rights?", answer: "No. The form is a draft-only preview. There is no franchise offer, exclusivity, signed agreement or reservation." },
            { question: "Are returns or franchise fees confirmed?", answer: "No. No investment return, exclusivity, fee, location or commercial commitment is promised on this page." },
            { question: "What happens before any potential agreement?", answer: "Eligibility review, due diligence, legal and financial advice, confirmed terms and separate written agreements would be required." },
          ]} />
        </div>
      </Section>
      <Section className="connection-reveal">
        <Badge>Proposal stage · details to be confirmed</Badge>
        <p className="body-copy">
          Partnership availability, locations, eligibility, commercial terms,
          program scope, and delivery commitments require confirmation. This
          page does not represent a signed partnership or an offer of guaranteed
          returns.
        </p>
      </Section>
      <CTASection
        title={
          <>
            A bigger future.
            <br />
            <em>Built together.</em>
          </>
        }
        href="#partnership-inquiry"
      />
    </>
  );
}
