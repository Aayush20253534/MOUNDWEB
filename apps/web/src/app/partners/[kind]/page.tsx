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
      >
        <ButtonLink href={`/contact?type=${item.type}#inquiry`}>
          Explore a partnership
        </ButtonLink>
      </PageHero>
      <Section>
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
      <Section>
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
        href={`/contact?type=${item.type}#inquiry`}
      />
    </>
  );
}
