import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { courses, programFaqs } from "@/lib/content";
import { PageHero } from "@/components/sections/page-hero";
import {
  Section,
  SectionHeading,
  Eyebrow,
  IconTile,
  Badge,
  FeaturePanel,
} from "@/components/ui/primitives";
import { CourseCard } from "@/components/ui/cards";
import { Icon } from "@/components/ui/icon";
import { Accordion } from "@/components/ui/accordion";
import { CTASection } from "@/components/sections/shared";

export const metadata: Metadata = {
  title: "Our Programs",
  description:
    "Digital Marketing and Web Development courses, including AI-integrated marketing programs.",
};
export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our programs"
        title={
          <>
            Skills for today.
            <br />
            Possibilities for
            <br />
            <em>tomorrow.</em>
          </>
        }
        description="Explore Digital Marketing and Web Development. A learning journey built around practical skills, curious minds, and a changing digital world."
        image="programs-ascent"
        className="programs-hero"
        artwork={
          <div className="learning-path-labels">
            {["Discover", "Learn", "Build", "Grow"].map((label, index) => (
              <span key={label}>
                <b>0{index + 1}</b>
                {label}
              </span>
            ))}
          </div>
        }
      >
        <div className="hero-learning-benefits">
          {[
            { icon: "briefcase" as const, text: "Practical thinking" },
            { icon: "layers" as const, text: "Project focus" },
            { icon: "brain" as const, text: "AI integration" },
            { icon: "cap" as const, text: "Career perspective" },
          ].map((item) => (
            <div key={item.text}>
              <Icon name={item.icon} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </PageHero>
      <Section className="program-paths">
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
              tag: "6 programs · AI included",
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
      <Section className="program-catalog">
        <div className="program-group" id="digital-marketing">
          <div className="program-group-header">
            <IconTile name="chart" />
            <div>
              <Eyebrow>Find your momentum</Eyebrow>
              <h2>Digital Marketing programs</h2>
              <p>
                Build a foundation, explore AI, and develop a broader marketing
                practice.
              </p>
            </div>
            <Badge>AI-integrated learning</Badge>
          </div>
          <div className="card-grid course-grid">
            {courses
              .filter((c) => c.category === "Digital Marketing")
              .map((course) => (
                <CourseCard course={course} key={course.slug} />
              ))}
          </div>
        </div>
        <div className="program-group" id="web-development">
          <div className="program-group-header">
            <IconTile name="code" />
            <div>
              <Eyebrow>Build what comes next</Eyebrow>
              <h2>Web Development programs</h2>
              <p>Explore the craft behind modern websites and applications.</p>
            </div>
            <Badge>Course offerings</Badge>
          </div>
          <div className="card-grid course-grid">
            {courses
              .filter((c) => c.category === "Web Development")
              .map((course) => (
                <CourseCard course={course} key={course.slug} />
              ))}
          </div>
        </div>
        <p className="catalog-note">
          <strong>Program information:</strong> Course focus areas are proposed
          outlines. Web Development durations, all fees, final curricula,
          delivery formats, and outcomes are to be confirmed before enrollment.
          No employment outcome is guaranteed.
        </p>
      </Section>
      <Section>
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
      <CTASection
        eyebrow="Ready to explore?"
        title={
          <>
            Start your <em>learning journey.</em>
          </>
        }
        centered
        description="Bring your curiosity. Find a program that fits your next chapter."
        primaryLabel="Ask about a program"
        href="/contact?type=course#inquiry"
      />
      <Section>
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
