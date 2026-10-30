import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Compass, Lightbulb } from "lucide-react";
import { services } from "@/lib/content";
import { breadcrumbGraph, jsonLd, serviceGraph } from "@/lib/seo";
import { getServiceGuide } from "@/lib/service-guides";
import { Breadcrumbs, ButtonLink, Container, Eyebrow, Section, SectionHeading } from "@/components/ui/primitives";

import { Accordion } from "@/components/ui/accordion";
import { ServiceMotion } from "@/components/services/service-motion";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return {
    title: service ? service.title : "Service",
    description: service ? service.title + ": " + service.summary + " Explore MOUNDWEB digital growth services and practical approaches." : undefined,
    alternates: service ? { canonical: "/services/" + slug } : undefined,
  };
}
export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const guide = getServiceGuide(service);
  return (
    <>
      <ServiceMotion />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceGraph(service)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbGraph([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: service.title, path: "/services/" + service.slug },
      ])) }} />
      <Container>
        <Breadcrumbs items={[
          { label: "Our Services", href: "/services" },
          { label: service.title },
        ]} />
      </Container>
      <Section className="service-detail-section">
        <div className="service-detail-hero">
          <div className="service-detail-copy service-reveal">
            <Eyebrow>Digital Marketing & Brand Growth / {guide.direction}</Eyebrow>
            <h1>{service.title}</h1>
            <p className="service-detail-lead">{guide.positioning}</p>
            <p className="body-copy">{guide.overview}</p>
            <div className="service-detail-actions">
              <ButtonLink href={"/contact?type=growth&subject=" + encodeURIComponent(service.title) + "#inquiry"}>
                Discuss this service
              </ButtonLink>
              <ButtonLink href="#approach" variant="secondary">Explore our approach</ButtonLink>
            </div>
          </div>
          <div className="service-detail-visual service-reveal">
            <Image
              src={"/assets/services/" + service.image + ".webp"}
              alt={"Illustrative visual for " + service.title}
              width={840} height={640} priority
              sizes="(max-width: 800px) 100vw, 44vw"
            />
            <div className="service-detail-visual-caption">
              <Lightbulb size={20} aria-hidden="true" />
              <span>{guide.clientQuestion}</span>
            </div>
          </div>
        </div>
      </Section>
      {service.slug === "seo" && (
        <Section className="service-reveal" id="local-international-seo">
          <SectionHeading
            eyebrow="Local, national and international search"
            title={<>Get discovered across <em>relevant markets.</em></>}
            description="Effective SEO helps people find services whether searching nearby, across India or internationally. Plans depend on actual audiences, verified business information and useful content."
          />
          <div className="service-activities-grid">
            <article className="service-activity">
              <div>
                <h3>Local SEO and map discovery</h3>
                <p className="body-copy">For eligible local businesses, start with accurate contact details, Google Business Profile optimization, location-relevant content and consistent service descriptions. Fake addresses and doorway pages are not part of the approach.</p>
              </div>
            </article>
            <article className="service-activity">
              <div>
                <h3>India-wide search visibility</h3>
                <p className="body-copy">Connect relevant service pages, technical crawlability, useful internal links and intent-led content with performance measured through Google Search Console.</p>
              </div>
            </article>
            <article className="service-activity">
              <div>
                <h3>International search foundations</h3>
                <p className="body-copy">Research real overseas intent, localize content for each target market and implement hreflang only after authentic multilingual or regional pages are published.</p>
              </div>
            </article>
          </div>
        </Section>
      )}
      <Section className="service-detail-activities service-reveal">
        <SectionHeading
          eyebrow="Where we can focus"
          title={<>The right pieces, <em>thoughtfully connected.</em></>}
          description="A selection of possible engagement activities. Final deliverables are agreed after discovery."
        />
        <div className="service-activities-grid">
          {guide.activities.map((activity, index) => (
            <article className="service-activity" key={activity}>
              <span>0{index + 1}</span>
              <Check size={18} aria-hidden="true" />
              <h3>{activity}</h3>
            </article>
          ))}
        </div>
      </Section>
      <Section id="approach" className="service-detail-process service-reveal">
        <div className="service-detail-process-heading">
          <div>
            <Eyebrow>Our approach</Eyebrow>
            <h2>Plan with <em>purpose.</em></h2>
          </div>
          <p>Every engagement starts with context. This is an illustrative working model, not a fixed engagement contract.</p>
        </div>
        <ol className="service-detail-steps">
          {guide.steps.map((step, index) => (
            <li key={step.title}>
              <span>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section className="service-detail-signals service-reveal">
        <div className="service-signals-grid">
          <div>
            <Eyebrow>Measure with care</Eyebrow>
            <h2>Understand <em>what matters.</em></h2>
            <p className="body-copy">
              Useful signals depend on agreed goals. Examples below are measurement themes, not achieved client results.
            </p>
          </div>
          <div className="service-signal-list">
            {guide.signals.map((signal, index) => (
              <div key={signal}><Compass size={19} aria-hidden="true" /><span>0{index + 1}</span><strong>{signal}</strong></div>
            ))}
          </div>
        </div>
      </Section>
      <Section className="service-detail-faq service-reveal">
        <div className="split-layout faq-layout">
          <div>
            <Eyebrow>Good to know</Eyebrow>
            <h2>A few <em>questions answered.</em></h2>
          </div>
          <Accordion items={guide.faqs} />
        </div>
      </Section>
      <Section className="service-detail-more service-reveal">
        <div className="service-detail-more-row">
          <Link href="/services" className="text-link"><ArrowLeft size={17} aria-hidden="true" /> All services</Link>
          <Link href="/services#service-explorer" className="text-link">
            Explore another direction <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </Section>
      
    </>
  );
}
