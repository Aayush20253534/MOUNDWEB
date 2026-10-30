import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Play, Quote } from "lucide-react";
import { services } from "@/lib/content";
import {
  ParticleMountainStage,
  OrbitGlobeStage,
} from "@/components/scenes/scene-stages";
import {
  ButtonLink,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
  IconTile,
  Badge,
} from "@/components/ui/primitives";
import { ServiceCard } from "@/components/ui/cards";
import { HomeMotion } from "@/components/scenes/home-motion";
import {
  CapabilityStrip,
  CheckList,
  CTASection,
  MeasurementPanel,
} from "@/components/sections/shared";

export const metadata: Metadata = {
  title: "Digital Marketing, SEO & Creative Growth",
  description: "MOUNDWEB combines SEO, social media, performance marketing, branding and creative strategy for business growth in India and online markets.",
  alternates: { canonical: "/" },
};
export default function HomePage() {
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <ParticleMountainStage />
        <Container className="home-hero-inner">
          <div className="hero-side-label">
            Digital
            <br />
            Marketing
            <br />& Learning
          </div>
          <div className="hero-float hero-float--one">
            <IconTile name="chart" />
            <div>
              <span>Search & discovery</span>
              <strong>
                Get noticed <ArrowUpRight size={18} />
              </strong>
              <small>Make your presence count</small>
            </div>
            <div className="mini-bars" aria-hidden="true">
              {[20, 35, 29, 48, 60, 76].map((n, i) => (
                <i key={i} style={{ height: n + "%" }} />
              ))}
            </div>
          </div>
          <div className="hero-float hero-float--two">
            <IconTile name="target" />
            <div>
              <span>Performance marketing</span>
              <strong>
                Inspire action <ArrowUpRight size={18} />
              </strong>
              <small>Connect attention with intent</small>
            </div>
            <svg viewBox="0 0 150 36" aria-hidden="true">
              <path d="M0 32Q15 30 27 24T50 26 75 16 99 19 125 6 150 3" />
            </svg>
          </div>
          <div className="hero-float hero-float--three">
            <IconTile name="users" />
            <div>
              <span>Community & creative</span>
              <strong>Build connection</strong>
            </div>
          </div>
          <div className="hero-float hero-float--four">
            <IconTile name="cap" />
            <div>
              <span>Future-ready skills</span>
              <strong>Learn. Apply. Grow.</strong>
            </div>
          </div>
          <div className="home-hero-copy">
            <Eyebrow>Strategy · Marketing · Creativity · Growth</Eyebrow>
            <h1 id="home-title">
              MOUND<span>WEB</span>
            </h1>
            <p>
              We turn attention into <em>growth.</em>
            </p>
            <div className="hero-keywords">
              <span />
              Grow <b>·</b> Rank <b>·</b> Convert
              <span />
            </div>
            <div className="hero-actions">
              <ButtonLink href="/contact?type=growth#inquiry">
                Start a project
              </ButtonLink>
              <Link href="/about#our-story" className="play-link">
                <span>
                  <Play size={16} fill="currentColor" aria-hidden="true" />
                </span>
                Discover our story
              </Link>
            </div>
          </div>
          <div className="hero-bottom">
            <p>
              Strategic thinking.
              <br />A brighter tomorrow.
            </p>
            <a href="#services" aria-label="Explore MOUNDWEB services">
              <ArrowDown size={18} aria-hidden="true" />
              Explore
            </a>
            <p>
              Built for brands.
              <br />
              Designed for possibility.
            </p>
          </div>
        </Container>
      </section>
      <HomeMotion />
      <CapabilityStrip />
      <Section id="services" className="home-motion">
        <SectionHeading
          eyebrow="Our services"
          title={
            <>
              Everything your brand
              <br />
              needs to <em>grow.</em>
            </>
          }
          description="From strategy to execution, connect your brand with the people who matter."
        >
          <ButtonLink href="/services" variant="secondary">
            Explore all services
          </ButtonLink>
        </SectionHeading>
        <div className="card-grid service-grid">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} compact />
          ))}
        </div>
      </Section>
      <Section className="approach-section home-motion">
        <div className="split-layout approach-layout">
          <OrbitGlobeStage />
          <div>
            <Eyebrow>Our approach</Eyebrow>
            <h2>
              Multiple channels.
              <br />
              One <em>growth engine.</em>
            </h2>
            <p className="body-copy">
              Your search, social, content, and campaigns should work together.
              We connect them through one clear brand strategy.
            </p>
            <CheckList
              items={[
                "Strategic planning",
                "Thoughtful execution",
                "Continuous optimization",
                "Clear measurement",
              ]}
            />
            <ButtonLink href="/services#process" variant="secondary">
              Explore our process
            </ButtonLink>
            <p className="micro-note">
              Platform icons illustrate channels, not partnerships.
            </p>
          </div>
        </div>
      </Section>
      <div className="home-motion">
        <MeasurementPanel />
      </div>
      <Section className="home-learning home-motion">
        <div className="split-layout">
          <div>
            <Eyebrow>Grow beyond your brand</Eyebrow>
            <h2>
              Skills for today.
              <br />
              <em>Possibilities for tomorrow.</em>
            </h2>
            <p className="body-copy">
              Explore Digital Marketing and Web Development learning paths.
              Build a foundation, discover AI tools, and develop your next set
              of skills.
            </p>
          </div>
          <div className="learning-links">
            <Link href="/programs#digital-marketing">
              <IconTile name="chart" />
              <span>
                <small>Strategy, creative & AI</small>
                <strong>Digital Marketing</strong>
              </span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link href="/programs#web-development">
              <IconTile name="code" />
              <span>
                <small>From foundations to full-stack</small>
                <strong>Web Development</strong>
              </span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>
      <Section className="stories-section home-motion">
        <div className="split-layout">
          <div>
            <Eyebrow>Built on relationships</Eyebrow>
            <h2>
              Great work starts
              <br />
              with <em>shared ambition.</em>
            </h2>
            <p className="body-copy">
              A clear goal. An open conversation. A commitment to making the
              next step count.
            </p>
          </div>
          <div className="story-placeholder">
            <Quote size={30} aria-hidden="true" />
            <Badge>Client stories · coming soon</Badge>
            <h3>
              Real voices.
              <br />
              Real journeys.
            </h3>
            <p>
              Verified client stories and case studies will be shared here. No
              sample endorsements are presented as real.
            </p>
            <div className="story-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </Section>
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
    </>
  );
}
