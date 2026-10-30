import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { programFaqs } from "@/lib/content";
import { ProgramCatalog } from "@/components/programs/program-catalog";
import { ProgramMotion } from "@/components/programs/program-motion";
import { ProgramHero } from "@/components/programs/program-hero";
import {
  Section,
  SectionHeading,
  Eyebrow,
  IconTile,
  FeaturePanel,
} from "@/components/ui/primitives";
import { Accordion } from "@/components/ui/accordion";


export const metadata: Metadata = {
  alternates: { canonical: "/programs" },
  title: "Our Programs",
  description:
    "Digital Marketing and Web Development courses, including AI-integrated marketing programs.",
};
export default function ProgramsPage() {
  return (
    <>
      <ProgramMotion />
      <ProgramHero />
      <Section id="learning-paths" className="program-paths program-reveal">
        <SectionHeading
          eyebrow="Explore our programs"
          title={
            <>
              Programs built for <em>what’s next.</em>
            </>
          }
          description="Two connected learning paths. Find the direction that matches your curiosity."
          centered
        />
        <div className="path-grid">
          {[
            {
              id: "digital-marketing",
              icon: "chart" as const,
              title: "Digital Marketing",
              body: "Strategy, content, campaigns, and the growing role of AI in marketing.",
              tag: "6 programs · AI courses within Digital Marketing",
            },
            {
              id: "web-development",
              icon: "code" as const,
              title: "Web Development",
              body: "From your first web page to thoughtful, full-stack digital experiences.",
              tag: "5 proposed programs",
            },
          ].map((item) => (
            <a href={`#${item.id}`} className="path-card" key={item.id}>
              <IconTile name={item.icon} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span>{item.tag}</span>
              </div>
              <ArrowDown size={20} aria-hidden="true" />
            </a>
          ))}
        </div>
      </Section>
      <Section className="program-catalog program-reveal">
        <div className="program-catalog-intro">
          <Eyebrow>Choose your next step</Eyebrow>
          <h2>Explore the <em>learning paths.</em></h2>
          <p className="body-copy">
            Search by skill, select an experience level, or focus on one of our two program categories.
            All AI marketing tracks remain under Digital Marketing.
          </p>
        </div>
        <ProgramCatalog />
        <p className="catalog-note">
          <strong>Before enrollment:</strong> All curriculum modules, prerequisites,
          project examples, outcomes, Web Development durations, fees, schedules and delivery
          arrangements are draft guidance requiring approval. These are information previews,
          not confirmed admission offers or employment guarantees.
        </p>
      </Section>
      <Section className="program-reveal">
        <div className="split-layout">
          <div>
            <Eyebrow>Why learn with MOUNDWEB</Eyebrow>
            <h2>
              More than
              <br />
              <em>just a course.</em>
            </h2>
            <p className="body-copy">
              Connect what you learn with what you can create. Build
              understanding one practical step at a time.
            </p>
            <Link className="text-link" href="/training-placements">
              Our approach to training
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="feature-grid">
            <FeaturePanel icon="book" title="Relevant learning">
              Develop a foundation in a changing digital world.
            </FeaturePanel>
            <FeaturePanel icon="briefcase" title="Project perspective">
              See how individual skills fit into a complete idea.
            </FeaturePanel>
            <FeaturePanel icon="users" title="Shared exploration">
              Learn through discussion, feedback, and curiosity.
            </FeaturePanel>
            <FeaturePanel icon="target" title="A clear direction">
              Choose the path that fits your own ambitions.
            </FeaturePanel>
          </div>
        </div>
      </Section>
      
      <Section className="program-reveal">
        <div className="split-layout faq-layout">
          <div>
            <Eyebrow>Frequently asked questions</Eyebrow>
            <h2>
              Have questions?
              <br />
              <em>Start here.</em>
            </h2>
          </div>
          <Accordion items={programFaqs} />
        </div>
      </Section>
    </>
  );
}
