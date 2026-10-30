import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ChartColumnIncreasing, GraduationCap, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";

import { ButtonLink, Eyebrow, Section } from "@/components/ui/primitives";
import { EditorialMotion } from "@/components/editorial/editorial-motion";
import { PlacementDashboard } from "@/components/careers/placement-dashboard";

export const metadata: Metadata = {
  title: "Training & Placements | Verified Progress",
  description: "Learn about MOUNDWEB training pathways and transparent placement reporting. No verified outcome records or employment guarantees are currently published.",
  robots: { index: false, follow: true },
};
export default function TrainingPlacementsPage() {
  return (
    <>
      <EditorialMotion />
      <PageHero
        className="opportunities-hero training-hero"
        eyebrow="Training & Placements / Transparent outcomes"
        title={<>Learn with purpose. <em>Measure with care.</em></>}
        description="Practical learning matters. So does evidence. Explore our training routes and the reporting standards that verified career-support and employment outcomes will follow."
        image="programs-ascent"
        artwork={
          <div className="training-hero-art" aria-hidden="true">
            <div className="training-hero-disc"><GraduationCap size={65} strokeWidth={1.4}/></div>
            <div className="training-hero-ring training-hero-ring--one"/>
            <div className="training-hero-ring training-hero-ring--two"/>
            <span className="training-hero-symbol training-hero-symbol--one"><BadgeCheck size={24}/></span>
            <span className="training-hero-symbol training-hero-symbol--two"><ShieldCheck size={24}/></span>
            <span className="training-hero-symbol training-hero-symbol--three"><ChartColumnIncreasing size={24}/></span>
          </div>
        }
      >
        <ButtonLink href="#placement-reporting">Explore reporting</ButtonLink>
      </PageHero>
      <Section className="training-tracks editorial-reveal">
        <div className="training-tracks-header">
          <Eyebrow>Learning pathways</Eyebrow>
          <h2>Two paths. <em>Room to learn.</em></h2>
          <p>Programs are educational offerings, not proof of placement outcomes or employment promises. All fees, schedules and eligibility remain subject to confirmation.</p>
        </div>
        <div className="training-track-grid">
          <Link href="/programs#digital-marketing">
            <span className="training-track-number">01 / Learning track</span>
            <h3>Digital Marketing</h3>
            <p>Audience understanding, campaign strategy, branding and the AI-assisted marketing course family.</p>
            <span>Explore programs <ArrowRight size={17} aria-hidden="true"/></span>
          </Link>
          <Link href="/programs#web-development">
            <span className="training-track-number">02 / Learning track</span>
            <h3>Web Development</h3>
            <p>Technical foundations, user interfaces, full-stack development and responsible AI coding practice.</p>
            <span>Explore programs <ArrowRight size={17} aria-hidden="true"/></span>
          </Link>
        </div>
      </Section>
      <Section className="training-journey editorial-reveal">
        <div className="training-tracks-header">
          <Eyebrow>The proposed learner journey</Eyebrow>
          <h2>Learning is <em>more than a number.</em></h2>
          <p>An illustrative progression, not a guaranteed completion or placement pathway.</p>
        </div>
        <ol className="training-journey-list">
          {[
            ["Discover", "Discuss eligibility, interests and expectations."],
            ["Learn", "Follow a documented program and practical learning activities."],
            ["Demonstrate", "Complete assessed projects and meet defined criteria."],
            ["Explore next steps", "Discuss eligible career support without a promised employment outcome."],
          ].map(([title,description],index) =>
            <li key={title}><span>0{index+1}</span><h3>{title}</h3><p>{description}</p></li>)}
        </ol>
      </Section>
      <Section id="placement-reporting" className="training-reporting editorial-reveal">
        <PlacementDashboard />
      </Section>
      <Section className="training-reporting-footer editorial-reveal">
        <div>
          <Eyebrow>Ethics and transparency</Eyebrow>
          <h2>No numbers without <em>evidence.</em></h2>
          <p>Student records, personal identifiers, salary figures, placement rates and employer testimonials require verification, consent, and approved privacy processes before publication. The absence of a statistic is not a zero result.</p>
        </div>
        <Link href="/programs" className="text-link">Review training courses <ArrowRight size={16} aria-hidden="true"/></Link>
      </Section>
      
    </>
  );
}
