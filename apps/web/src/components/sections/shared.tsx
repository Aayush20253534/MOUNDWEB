import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ArrowUpRight } from "lucide-react";
import {
  ButtonLink,
  Container,
  Eyebrow,
  IconTile,
  SectionHeading,
} from "../ui/primitives";
import { Icon } from "../ui/icon";
import { Landscape } from "../scenes/scene-stages";

export function CapabilityStrip() {
  return (
    <div className="capability-strip">
      <Container>
        <p>One connected approach to growth</p>
        <div>
          {[
            "Strategy",
            "Search",
            "Social",
            "Creative",
            "Performance",
            "Learning",
          ].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </Container>
    </div>
  );
}
export function CTASection({
  eyebrow = "Let’s build together",
  title = (
    <>
      Ready to <em>grow</em>
      <br />
      your next chapter?
    </>
  ),
  description = "For brands, students, colleges, and partners. A bigger future starts with a conversation.",
  centered = false,
  primaryLabel = "Start a conversation",
  href = "/contact#inquiry",
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: string;
  centered?: boolean;
  primaryLabel?: string;
  href?: string;
}) {
  return (
    <section className={`cta-section ${centered ? "cta-section--center" : ""}`}>
      <Container>
        <div className="cta-panel">
          <Landscape name="mountain-panorama" />
          <div className="cta-title">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2>{title}</h2>
          </div>
          <div className="cta-copy">
            <p>{description}</p>
            <ButtonLink href={href}>{primaryLabel}</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
const measurementSignals = [
  { label: "Visibility", value: "Be discovered", note: "Organic search", illustration: "visibility" },
  { label: "Engagement", value: "Build connection", note: "Audience interaction", illustration: "engagement" },
  { label: "Conversion", value: "Inspire action", note: "Meaningful inquiries", illustration: "conversion" },
  { label: "Retention", value: "Create loyalty", note: "Returning customers", illustration: "retention" },
] as const;

export function MeasurementPanel({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`measurement-section ${compact ? "measurement-section--compact" : "measurement-section--illustrated"}`}
    >
      <Container>
        <div className="measurement-panel">
          <SectionHeading
            eyebrow="Measure what matters"
            title={
              <>
                Growth has a story.
                <br />
                <em>Give it clarity.</em>
              </>
            }
            description="A focused view of the signals that shape your next decision."
          />
          <div className="measurement-grid">
            {measurementSignals.map(({ label, value, note, illustration }, index) => (
              <article className="measurement-card" key={label}>
                <span className="measurement-index">0{index + 1}</span>
                {!compact && (
                  <Image
                    className="measurement-card-art"
                    src={`/assets/graphics/measurement-${illustration}.svg`}
                    alt=""
                    width={256}
                    height={220}
                    unoptimized
                    aria-hidden="true"
                  />
                )}
                <div className="measurement-card-copy">
                  <h3>{label}</h3>
                  <strong>{value}</strong>
                  <p>{note}</p>
                </div>
                <svg viewBox="0 0 200 52" aria-hidden="true">
                  <path d={`M0 46 L20 ${39 - index * 2} 39 41 59 29 78 31 98 21 118 24 138 10 158 13 180 5 200 1`} />
                  <path
                    className="chart-fill"
                    d="M0 46 20 39 39 41 59 29 78 31 98 21 118 24 138 10 158 13 180 5 200 1V52H0Z"
                  />
                </svg>
              </article>
            ))}
          </div>
          <p className="illustration-note">
            Illustrative measurement framework. No client results or performance
            claims are shown.
          </p>
        </div>
      </Container>
    </section>
  );
}
export function ProcessSteps() {
  return (
    <div className="process-steps">
      {[
        {
          icon: "book" as const,
          title: "Understand your goals",
          body: "Your business, your audience, and where you want to go.",
        },
        {
          icon: "settings" as const,
          title: "Create a strategy",
          body: "A focused plan built around your priorities.",
        },
        {
          icon: "rocket" as const,
          title: "Execute & optimize",
          body: "Bring the plan to life. Learn, refine, and improve.",
        },
        {
          icon: "chart" as const,
          title: "Measure what matters",
          body: "Clear reporting that informs your next move.",
        },
      ].map((step, index) => (
        <article key={step.title}>
          <div className="process-icon">
            <Icon name={step.icon} />
            <span>0{index + 1}</span>
          </div>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </article>
      ))}
    </div>
  );
}
export function PartnerCards() {
  return (
    <div className="partner-cards">
      {[
        {
          slug: "colleges",
          icon: "building" as const,
          title: "For colleges & institutions",
          body: "Connect learning with practical industry exposure and new possibilities.",
          image: "college-partnership",
          label: "Explore college partnerships",
        },
        {
          slug: "franchise",
          icon: "handshake" as const,
          title: "For franchise partners",
          body: "Explore a shared vision for growing skills, brands, and opportunity.",
          image: "franchise-partnership",
          label: "Explore franchise opportunities",
        },
      ].map((item) => (
        <article key={item.slug} className="partner-card">
          <Image
            src={`/assets/partnerships/${item.image}.webp`}
            alt=""
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
          <div className="partner-shade" />
          <div className="partner-content">
            <IconTile name={item.icon} />
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <Link href={`/partners/${item.slug}`} className="text-link">
              {item.label}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list check-list--large">
      {items.map((item) => (
        <li key={item}>
          <Check size={15} aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
export function EditorialLink({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link className="editorial-link" href={href}>
      <h3>
        {title}
        <ArrowUpRight size={20} aria-hidden="true" />
      </h3>
      <p>{text}</p>
    </Link>
  );
}
