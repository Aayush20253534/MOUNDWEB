import type { Metadata } from "next";
import { ArrowUpRight, Images, Newspaper, Sparkles } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";

import { Section, Eyebrow, ButtonLink } from "@/components/ui/primitives";
import { EditorialCatalog } from "@/components/editorial/editorial-catalog";
import { EditorialMotion } from "@/components/editorial/editorial-motion";
import { MediaGallery } from "@/components/editorial/media-gallery";
import { getPublicEditorialLists } from "@/lib/editorial-remote";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublicEditorialLists();
  const hasPublished = content.media.length > 0;
  return {
    title: "Media | Editorial & Visual Archive",
    description: hasPublished
      ? "Published MOUNDWEB perspectives, original features, and editorial updates."
      : "Explore MOUNDWEB editorial concepts and original visual studies. No press coverage or news updates are represented as published yet.",
    robots: { index: hasPublished, follow: true },
    alternates: hasPublished ? { canonical: "/media" } : undefined,
  };
}
export default function MediaPage() {
  return (
    <>
      <EditorialMotion />
      <PageHero
        eyebrow="MOUNDWEB media / Editorial concepts"
        title={<>Ideas worth <em>sharing.</em></>}
        description="Perspectives on brand growth, useful skills and creative work. We are preparing a publishing space where future releases will be dated, sourced and verified."
        className="editorial-hero editorial-hero--media"
        image="about-world"
        artwork={
          <div className="media-hero-collage" aria-hidden="true">
            <div><Newspaper size={32}/><span>Perspectives</span></div>
            <div><Images size={35}/><span>Visual stories</span></div>
            <div><Sparkles size={30}/><span>Studio thinking</span></div>
          </div>
        }
      >
        <ButtonLink href="#media-library">Explore media concepts</ButtonLink>
      </PageHero>
      <Section id="media-library" className="editorial-discovery editorial-reveal">
        <EditorialCatalog kind="media" />
      </Section>
      <Section className="editorial-gallery-section editorial-reveal">
        <MediaGallery />
      </Section>
      <Section className="editorial-process editorial-reveal">
        <div>
          <Eyebrow>Before publishing</Eyebrow>
          <h2>Every story deserves <em>context.</em></h2>
          <p>Genuine releases will include approved text, publication dates and relevant image permissions. The visuals above are MOUNDWEB design illustrations, not representations of actual media appearances, events or customers.</p>
        </div>
        <div className="editorial-process-symbol"><ArrowUpRight size={72} aria-hidden="true"/></div>
      </Section>
      
    </>
  );
}
