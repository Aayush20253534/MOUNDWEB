import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ListMusic, ScrollText } from "lucide-react";
import { episodes, getEpisode, isPublishedEpisode } from "@/lib/editorial";
import { getPublishedEpisode } from "@/lib/editorial-remote";
import { AudioPlayer } from "@/components/editorial/audio-player";
import { EditorialMotion } from "@/components/editorial/editorial-motion";
import { Breadcrumbs, ButtonLink, Container, Eyebrow, Section } from "@/components/ui/primitives";
import { CTASection } from "@/components/sections/shared";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = true;
export function generateStaticParams() { return episodes.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedEpisode(slug) ?? getEpisode(slug);
  return {
    title: item ? item.title + " | Podcast" : "Podcast",
    description: item?.summary,
    robots: { index: Boolean(item && isPublishedEpisode(item)), follow: true },
    alternates: item && isPublishedEpisode(item) ? { canonical: "/podcast/" + slug } : undefined,
  };
}
export default async function EpisodePage({ params }: Props) {
  const { slug } = await params;
  const item = getEpisode(slug);
  if (!item) notFound();
  const published = isPublishedEpisode(item);
  return (
    <>
      <EditorialMotion />
      <Container><Breadcrumbs items={[{ label: "Podcast", href: "/podcast" }, { label: item.title }]} /></Container>
      <Section className="editorial-detail-hero">
        <div className="editorial-detail-grid">
          <div className="editorial-detail-content editorial-reveal">
            <Eyebrow>{item.category} / {published ? "Published episode" : "Unpublished episode concept"}</Eyebrow>
            <h1>{item.title}</h1>
            <p className="editorial-detail-lead">{item.summary}</p>
            <div className="editorial-topic-list">{item.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
            <p className="editorial-draft-disclosure">{published
              ? "A verified recording with accessible listening information."
              : "Planning preview only. This is not a released recording, interview or confirmed guest appearance."}</p>
            <ButtonLink href="#listen" variant="secondary">Episode player</ButtonLink>
          </div>
          <div className="editorial-detail-art editorial-reveal">
            <Image src={item.artwork} width={900} height={700}
              alt={"Illustrative concept cover for " + item.title}
              sizes="(max-width: 900px) 100vw, 45vw" priority />
            <span>{published ? "Episode cover" : "Concept cover · Unpublished"}</span>
          </div>
        </div>
      </Section>
      <Section id="listen" className="editorial-listen editorial-reveal">
        <AudioPlayer title={item.title} audioSrc={published ? item.audioSrc : undefined}
          durationSeconds={item.durationSeconds} transcriptAvailable={Boolean(item.transcript)} />
      </Section>
      <Section className="editorial-detail-outline editorial-reveal">
        <div className="editorial-outline-heading">
          <div><Eyebrow>Editorial outline</Eyebrow><h2>{published ? "In this episode" : "Ideas we may explore."}</h2></div>
          <p>{published ? "Discussion highlights" : "Proposed talking points, not claims about a recorded conversation."}</p>
        </div>
        <ol className="editorial-outline-list">
          {item.outline.map((point, index) => <li key={point}><span>0{index + 1}</span><p>{point}</p><ListMusic size={20} aria-hidden="true"/></li>)}
        </ol>
      </Section>
      <Section className="editorial-transcript editorial-reveal">
        <ScrollText size={24} aria-hidden="true" />
        <h2>Accessible transcript</h2>
        {published && item.transcript
          ? <div className="editorial-transcript-body">{item.transcript}</div>
          : <p>The transcript will appear alongside a verified recording. No transcript or episode audio is published yet.</p>}
      </Section>
      <Section className="editorial-back-section">
        <div className="editorial-back-nav">
          <Link href="/podcast" className="text-link"><ArrowLeft size={17} aria-hidden="true"/> All podcast concepts</Link>
          <Link href="/media" className="text-link">Explore media <ArrowRight size={17} aria-hidden="true"/></Link>
        </div>
      </Section>
      <CTASection title={<>Keep the conversation <em>moving.</em></>}
        description="Propose a topic or collaboration through the local Contact inquiry preview."
        primaryLabel="Prepare a topic inquiry" href="/contact?type=media&subject=Podcast%20topic#inquiry"/>
    </>
  );
}
