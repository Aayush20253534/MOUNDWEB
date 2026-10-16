import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Compass, HeartHandshake, Lightbulb, Sparkles } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/shared";
import { ButtonLink, Eyebrow, Section } from "@/components/ui/primitives";
import { EditorialMotion } from "@/components/editorial/editorial-motion";
import { CareerExplorer } from "@/components/careers/career-explorer";

export const metadata: Metadata = {
  title: "Careers & Opportunities",
  description: "Explore MOUNDWEB work areas and learn how verified vacancies will be published. There are currently no confirmed open roles.",
  robots: { index: false, follow: true },
};
export default function CareerPage() {
  return (
    <>
      <EditorialMotion />
      <PageHero
        className="opportunities-hero career-hero"
        eyebrow="Careers at MOUNDWEB / Future opportunities"
        title={<>Build ideas. <em>Grow together.</em></>}
        description="The future of digital growth connects strategy, creative thinking and education. Explore our areas of work, without mistaking them for live job vacancies."
        image="mountain-panorama"
        artwork={
          <div className="career-hero-art" aria-hidden="true">
            <div className="career-hero-orbit career-hero-orbit--first"/>
            <div className="career-hero-orbit career-hero-orbit--second"/>
            <span><BriefcaseBusiness size={44}/></span>
            <i /><i /><i />
          </div>
        }
      >
        <ButtonLink href="#opportunities">Explore career areas</ButtonLink>
      </PageHero>
      <Section className="career-values editorial-reveal">
        <div className="career-values-intro">
          <Eyebrow>The thinking behind our work</Eyebrow>
          <h2>Curiosity, clarity, <em>craft.</em></h2>
          <p>These are values we aim to express in how we work, not promises about employment conditions or benefits.</p>
        </div>
        <div className="career-values-grid">
          {[
            { icon: Compass, title: "A clear direction", body: "Ask better questions before choosing the next move." },
            { icon: Lightbulb, title: "Room for ideas", body: "Consider possibilities, test assumptions and learn from feedback." },
            { icon: HeartHandshake, title: "Work with purpose", body: "Connect practical goals with respect for the people involved." },
          ].map(({ icon: Icon, title, body }) =>
            <article key={title}><Icon size={26} aria-hidden="true"/><h3>{title}</h3><p>{body}</p></article>
          )}
        </div>
      </Section>
      <Section id="opportunities" className="career-explorer-section editorial-reveal">
        <CareerExplorer />
      </Section>
      <Section className="career-steps editorial-reveal">
        <div className="career-steps-head">
          <div><Eyebrow>When vacancies become available</Eyebrow><h2>A process with <em>clear expectations.</em></h2></div>
          <p>The following illustrates how a responsible recruitment process could work. No active hiring cycle is announced.</p>
        </div>
        <ol className="career-steps-grid">
          {[
            ["Discover", "Read a verified role description, location, eligibility and closing date."],
            ["Apply", "Use the authorized channel shown on the specific published opening."],
            ["Review", "Receive process and status details from the hiring team after applications are enabled."],
          ].map(([name, description], index) =>
            <li key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{description}</p><ArrowRight size={19} aria-hidden="true"/></li>)}
        </ol>
      </Section>
      <Section className="career-fairness editorial-reveal">
        <div><Sparkles size={25} aria-hidden="true"/><h2>Opportunity needs <em>transparency.</em></h2></div>
        <p>No application form, CV upload, payment or sensitive candidate information is collected on this page. General questions can be drafted through Contact, but the current site does not transmit them.</p>
        <Link className="text-link" href="/contact?type=career&subject=General%20career%20question#inquiry">
          Prepare a career question <ArrowRight size={16} aria-hidden="true"/>
        </Link>
      </Section>
      <CTASection
        title={<>Stay curious about <em>what comes next.</em></>}
        description="Explore our training programs or prepare a general question. Job application submissions are not available until verified openings and a secure backend are released."
        primaryLabel="Explore our programs"
        href="/programs"
      />
    </>
  );
}
