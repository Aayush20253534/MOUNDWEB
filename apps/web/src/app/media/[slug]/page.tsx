import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Images } from "lucide-react";
import { getMedia, isPublishedMedia, mediaItems } from "@/lib/editorial";
import { getPublishedMedia } from "@/lib/editorial-remote";
import { EditorialMotion } from "@/components/editorial/editorial-motion";
import { Breadcrumbs, Container, Eyebrow, Section, ButtonLink } from "@/components/ui/primitives";
import { CTASection } from "@/components/sections/shared";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = true;
export function generateStaticParams() { return mediaItems.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedMedia(slug) ?? getMedia(slug);
  return {
    title: item ? item.title + " | Media" : "Media",
    description: item?.summary,
    robots: { index: Boolean(item && isPublishedMedia(item)), follow: true },
  };
}
export default async function MediaDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getMedia(slug);
  if (!item) notFound();
  const published = isPublishedMedia(item);
  return (
    <>
      <EditorialMotion />
      <Container><Breadcrumbs items={[{ label: "Media", href: "/media" }, { label: item.title }]} /></Container>
      <Section className="editorial-detail-hero">
        <div className="editorial-detail-grid">
          <div className="editorial-detail-content editorial-reveal">
            <Eyebrow>{item.category} / {published ? "Published feature" : "Unpublished editorial concept"}</Eyebrow>
            <h1>{item.title}</h1>
            <p className="editorial-detail-lead">{item.summary}</p>
            <p className="editorial-draft-disclosure">{published
              ? "Approved editorial content."
              : "Planning preview only. This is not published journalism, actual press coverage, or a report of an event."}</p>
            <ButtonLink href="#feature-outline" variant="secondary">Explore the concept</ButtonLink>
          </div>
          <figure className="editorial-detail-art editorial-reveal">
            <Image src={item.artwork} width={900} height={700} alt={item.caption}
              sizes="(max-width: 900px) 100vw, 45vw" priority />
            <figcaption>{item.caption}</figcaption>
          </figure>
        </div>
      </Section>
      <Section id="feature-outline" className="editorial-detail-outline editorial-reveal">
        <div className="editorial-outline-heading">
          <div><Eyebrow>{published ? "Feature" : "Proposed feature outline"}</Eyebrow><h2>{published ? "The full story." : "Topics on the horizon."}</h2></div>
          <p>{published ? "Approved article" : "Possible themes, not an article or publication."}</p>
        </div>
        {published && item.body
          ? <div className="editorial-article">{item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          : <ol className="editorial-outline-list">
            {item.outline.map((point, index) => <li key={point}><span>0{index + 1}</span><p>{point}</p><Images size={20} aria-hidden="true"/></li>)}
          </ol>}
      </Section>
      <Section className="editorial-back-section">
        <div className="editorial-back-nav">
          <Link href="/media" className="text-link"><ArrowLeft size={17} aria-hidden="true"/> All media concepts</Link>
          <Link href="/podcast" className="text-link">Explore podcast <ArrowRight size={17} aria-hidden="true"/></Link>
        </div>
      </Section>
      <CTASection title={<>Good ideas deserve <em>attention.</em></>}
        description="Suggest a perspective or media collaboration using the local inquiry preview."
        primaryLabel="Prepare a media inquiry" href="/contact?type=media&subject=Editorial%20collaboration#inquiry" />
    </>
  );
}
