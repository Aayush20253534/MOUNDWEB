import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Target } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import {
  ButtonLink,
  Eyebrow,
  Section,
  SectionHeading,
  FeaturePanel,
  IconTile,
  Badge,
} from "@/components/ui/primitives";
import { StatCard } from "@/components/ui/cards";
import { CTASection, PartnerCards } from "@/components/sections/shared";
import { Icon } from "@/components/ui/icon";
import { AboutMotion } from "@/components/scenes/about-motion";
import { AboutHeroControls } from "@/components/scenes/about-hero-controls";
import { AboutJourney } from "@/components/sections/about-journey";
import type { IconName } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description:
    "Meet MOUNDWEB: digital marketing, brand growth, and practical professional learning.",
};
const values: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "lightbulb",
    title: "Innovation",
    body: "New ideas and useful technology, applied with purpose.",
  },
  {
    icon: "settings",
    title: "Execution",
    body: "Turn thoughtful strategy into consistent action.",
  },
  {
    icon: "book",
    title: "Learning",
    body: "Stay curious. Build skills. Keep moving forward.",
  },
  {
    icon: "chart",
    title: "Progress",
    body: "Focus on meaningful improvement over empty promises.",
  },
];
export default function AboutPage() {
  return (
    <>
      <AboutMotion />
      <PageHero
        eyebrow="About MOUNDWEB"
        title={
          <>
            Who we <em>are.</em>
          </>
        }
        description="We bring brands, skills, and opportunity together. MOUNDWEB connects digital marketing, AI-integrated learning, and a practical approach to growth."
        image="about-world"
        className="about-hero about-reveal"
        artwork={
          <>
            <div className="about-hero-orbits" aria-hidden="true">
              <span /><span /><span />
              <i /><i /><i /><i /><i />
            </div>
            <div className="hero-pillar-grid">
              {[
                ["chart", "Brand growth"],
                ["brain", "AI-integrated learning"],
                ["code", "Web development courses"],
                ["handshake", "Partnerships"],
              ].map(([icon, label]) => (
                <div className="hero-pillar" key={label}>
                  <Icon name={icon as IconName} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </>
        }
      >
        <h2 className="hero-subheading">
          We build brands, skills,
          <br />
          and growth that lasts.
        </h2>
        <div className="about-hero-actions">
          <ButtonLink href="#our-story">Our story</ButtonLink>
          <AboutHeroControls />
        </div>
      </PageHero>
      <Section id="our-story" className="about-reveal">
        <div className="split-layout story-layout">
          <div>
            <Eyebrow>Our story</Eyebrow>
            <h2>
              From digital growth
              <br />
              to <em>future-ready talent.</em>
            </h2>
            <p className="body-copy">
              MOUNDWEB brings two connected ambitions together: helping brands
              find their voice and helping people build useful digital skills.
            </p>
            <p className="body-copy">
              Our focus spans digital marketing, brand strategy, and
              professional learning in Digital Marketing and Web Development. AI
              is part of how we explore, create, and learn.
            </p>
            <p className="body-copy">
              We are building a place where brands, learners, colleges, and
              partners can shape what comes next.
            </p>
            <ButtonLink href="/programs" variant="secondary">
              Explore our programs
            </ButtonLink>
          </div>
          <div className="feature-grid about-values">
            {values.map((item) => (
              <div className="about-animate-item" key={item.title}>
              <FeaturePanel
                icon={item.icon}
                title={item.title}
              >
                {item.body}
              </FeaturePanel>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <AboutJourney />
      <Section className="mission-section about-reveal">
        <Eyebrow>Our mission & vision</Eyebrow>
        <div className="mission-grid">
          <article className="mission-card about-animate-item">
            <Image
              src="/assets/landscapes/summit-path.webp"
              alt=""
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
            />
            <div>
              <Target size={31} />
              <h2>Our mission</h2>
              <p>
                Make digital growth and practical learning more accessible
                through clear strategy, creative thinking, and useful skills.
              </p>
            </div>
          </article>
          <article className="mission-card">
            <Image
              src="/assets/landscapes/mountain-panorama.webp"
              alt=""
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
            />
            <div>
              <Eye size={31} />
              <h2>Our vision</h2>
              <p>
                A connected ecosystem where brands, learners, colleges, and
                partners grow with purpose and create lasting opportunity.
              </p>
            </div>
          </article>
        </div>
      </Section>
      <Section className="about-reveal">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Built across growth,
              <br />
              <em>learning, and opportunity.</em>
            </>
          }
          description="Different ambitions. One shared belief in moving forward."
        >
          <ButtonLink href="/services" variant="secondary">
            Explore our services
          </ButtonLink>
        </SectionHeading>
        <div className="capability-grid">
          {[
            {
              icon: "chart" as const,
              title: "Digital marketing",
              body: "Strategy and campaigns for brands.",
            },
            {
              icon: "brain" as const,
              title: "AI in marketing",
              body: "AI-integrated marketing education.",
            },
            {
              icon: "code" as const,
              title: "Web development courses",
              body: "Learn how digital experiences are built.",
            },
            {
              icon: "cap" as const,
              title: "Career pathways",
              body: "Learning with a professional focus.",
            },
            {
              icon: "play" as const,
              title: "Media & creative",
              body: "Ideas shaped into meaningful content.",
            },
            {
              icon: "building" as const,
              title: "Partnerships",
              body: "A shared approach to opportunity.",
            },
          ].map((item) => (
            <article className="about-animate-item" key={item.title}>
              <Icon name={item.icon} size={30} />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section className="impact-section about-reveal">
        <div className="split-layout">
          <div>
            <Eyebrow>Training & placement impact</Eyebrow>
            <h2>
              Learning journeys.
              <br />
              <em>Transparent records.</em>
            </h2>
            <p className="body-copy">
              Outcomes should be backed by evidence. Training and placement
              records will be published only after verification and consent.
            </p>
            <ButtonLink href="/training-placements" variant="secondary">
              View our approach
            </ButtonLink>
          </div>
          <div>
            <div className="impact-cards about-verified-stats">
              {[
                { icon: "users" as const, label: "Learners trained" },
                { icon: "briefcase" as const, label: "Placements assisted" },
                { icon: "cap" as const, label: "Program completion" },
                { icon: "handshake" as const, label: "Hiring connections" },
              ].map((item) => (
                <StatCard
                  key={item.label}
                  label={item.label}
                  value="—"
                  icon={item.icon}
                  note="Verification pending"
                />
              ))}
            </div>
            <div className="record-placeholder">
              <Icon name="chart" size={34} />
              <div>
                <h3>Evidence before numbers.</h3>
                <p>
                  Verified records will appear here. No placement or outcome
                  guarantee is implied.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Section className="subtle-section about-reveal">
        <div className="split-layout">
          <div>
            <Eyebrow>Why MOUNDWEB</Eyebrow>
            <h2>
              More than a platform.
              <br />
              <em>A growth mindset.</em>
            </h2>
            <p className="body-copy">
              Practical thinking, purposeful creativity, and a commitment to
              continuous learning.
            </p>
          </div>
          <div className="benefit-grid">
            {[
              {
                icon: "cap" as const,
                title: "Practical learning",
                body: "Build understanding through application.",
              },
              {
                icon: "brain" as const,
                title: "AI-aware thinking",
                body: "Explore tools with a critical perspective.",
              },
              {
                icon: "users" as const,
                title: "Shared knowledge",
                body: "Learn through conversation and collaboration.",
              },
              {
                icon: "layers" as const,
                title: "Project thinking",
                body: "Connect individual skills to a larger idea.",
              },
              {
                icon: "briefcase" as const,
                title: "Career perspective",
                body: "Keep professional relevance in focus.",
              },
              {
                icon: "target" as const,
                title: "Purposeful strategy",
                body: "Make the next step a considered one.",
              },
            ].map((item) => (
              <div key={item.title}>
                <Icon name={item.icon} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section className="about-reveal">
        <SectionHeading
          eyebrow="Partner with us"
          title={
            <>
              Let’s create bigger
              <br />
              <em>opportunities together.</em>
            </>
          }
          description="A shared vision for institutions, entrepreneurs, and the people they serve."
        />
        <PartnerCards />
      </Section>
      <Section className="team-section about-reveal">
        <div className="split-layout">
          <div>
            <Eyebrow>Our team & culture</Eyebrow>
            <h2>
              Different strengths.
              <br />
              <em>Shared direction.</em>
            </h2>
            <p className="body-copy">
              Strategy, learning, and creative thinking come together in our
              work.
            </p>
            <Badge>Role illustrations · team profiles to follow</Badge>
          </div>
          <div className="role-grid">
            {[
              {
                icon: "target" as const,
                title: "Strategists",
                body: "Plan. Align. Grow.",
                image: "strategists",
              },
              {
                icon: "book" as const,
                title: "Educators",
                body: "Teach. Guide. Empower.",
                image: "educators",
              },
              {
                icon: "pen" as const,
                title: "Creators",
                body: "Imagine. Shape. Make.",
                image: "creators",
              },
            ].map((item) => (
              <article className="about-animate-item" key={item.title}>
                <Image
                  src={`/assets/graphics/${item.image}.svg`}
                  alt=""
                  width={280}
                  height={250}
                />
                <div>
                  <IconTile name={item.icon} />
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>
      <CTASection
        title={
          <>
            Let’s build <em>growth</em>
            <br />
            with purpose.
          </>
        }
        primaryLabel="Contact us"
      />
    </>
  );
}
