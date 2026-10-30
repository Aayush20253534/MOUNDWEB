import type { Metadata } from "next";
import { ArrowUpRight, AudioLines, Headphones, Mic2 } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";

import { Eyebrow, Section, ButtonLink } from "@/components/ui/primitives";
import { EditorialCatalog } from "@/components/editorial/editorial-catalog";
import { EditorialMotion } from "@/components/editorial/editorial-motion";
import { getPublicEditorialLists } from "@/lib/editorial-remote";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublicEditorialLists();
  const hasPublished = content.podcast.length > 0;
  return {
    title: "Podcast | Ideas & Conversations",
    description: hasPublished
      ? "Published MOUNDWEB podcast episodes on digital growth, creative thinking and learning."
      : "Explore proposed conversations about digital growth, creative thinking and learning. MOUNDWEB has no published episodes yet.",
    robots: { index: hasPublished, follow: true },
    alternates: hasPublished ? { canonical: "/podcast" } : undefined,
  };
}
export default function PodcastPage() {
  return (
    <>
      <EditorialMotion />
      <PageHero
        eyebrow="The MOUNDWEB Podcast / In development"
        title={<>The minds behind <em>the momentum.</em></>}
        description="A future space for meaningful conversations about brands, creativity, AI, and digital learning. Our first recordings have not been published yet."
        className="editorial-hero editorial-hero--podcast"
        image="mountain-panorama"
        artwork={
          <div className="podcast-artwork" aria-hidden="true">
            <div className="podcast-artwork-circle podcast-artwork-circle--outer" />
            <div className="podcast-artwork-circle podcast-artwork-circle--inner" />
            <div className="podcast-artwork-center"><Mic2 size={68} strokeWidth={1.3} /></div>
            <div className="podcast-sound-bars">
              {Array.from({ length: 23 }, (_, index) => <i key={index} style={{ "--wave-index": index } as React.CSSProperties} />)}
            </div>
          </div>
        }
      >
        <ButtonLink href="#episodes">Explore episode concepts</ButtonLink>
      </PageHero>
      <Section className="editorial-values editorial-reveal">
        <div className="editorial-value-grid">
          {[
            { icon: Mic2, title: "Curious conversations", text: "Topics worth questioning, not unverified guest promises." },
            { icon: AudioLines, title: "Ideas in motion", text: "How strategy, creativity and technology could come together." },
            { icon: Headphones, title: "Accessible listening", text: "Future published episodes will require playable audio and transcripts." },
          ].map(({ icon: Icon, title, text }) =>
            <article key={title}><Icon size={26} aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>
          )}
        </div>
      </Section>
      <Section id="episodes" className="editorial-discovery editorial-reveal">
        <EditorialCatalog kind="podcast" />
      </Section>
      <Section className="editorial-process editorial-reveal">
        <div>
          <Eyebrow>Publishing commitment</Eyebrow>
          <h2>Thoughtful content. <em>Verified first.</em></h2>
          <p>Episode concepts are drafts, not recordings. Before an episode goes live, we will confirm the speaker credits, approved audio file, duration, publication date, content and transcript. No placeholder can be mistaken for a released episode.</p>
        </div>
        <div className="editorial-process-symbol"><ArrowUpRight size={72} aria-hidden="true"/></div>
      </Section>
      
    </>
  );
}
