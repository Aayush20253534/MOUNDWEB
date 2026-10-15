import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Quote } from "lucide-react";
import type { Course, Service, IconName } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Badge, ButtonLink, IconTile } from "./primitives";

export function ServiceCard({
  service,
  compact = false,
}: {
  service: Service;
  compact?: boolean;
}) {
  return (
    <article
      id={!compact ? service.slug : undefined}
      className={cn("service-card", compact && "service-card--compact")}
    >
      {!compact && (
        <div className="card-image">
          <Image
            src={`/assets/services/${service.image}.webp`}
            alt=""
            fill
            sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="service-card-content">
        <div className="card-title">
          <IconTile name={service.icon} />
          <h3>{service.title}</h3>
        </div>
        <p>{service.summary}</p>
        {!compact && (
          <ul className="check-list">
            {service.features.map((feature) => (
              <li key={feature}>
                <Check size={13} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        )}
        <Link
          className="text-link"
          href={
            compact
              ? `/services#${service.slug}`
              : `/contact?type=growth&subject=${encodeURIComponent(service.title)}#inquiry`
          }
        >
          {compact ? "Explore service" : "Let’s talk"}
          <ArrowRight size={14} aria-hidden="true" />
          <span className="sr-only"> about {service.title}</span>
        </Link>
      </div>
    </article>
  );
}
export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="course-card">
      <Link
        href={`/programs/${course.slug}`}
        className="course-image"
        aria-label={`View ${course.title}`}
      >
        <Image
          src={`/assets/courses/${course.image}.webp`}
          alt=""
          fill
          sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw"
        />
        {course.duration && <Badge>{course.duration}</Badge>}
      </Link>
      <div className="course-body">
        <h3>
          <Link href={`/programs/${course.slug}`}>{course.title}</Link>
        </h3>
        <p>{course.summary}</p>
        <p className="draft-label">Proposed learning focus</p>
        <ul className="check-list">
          {course.focus.map((item) => (
            <li key={item}>
              <Check size={12} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <ButtonLink
          href={`/programs/${course.slug}`}
          variant="secondary"
          size="small"
        >
          Explore program
        </ButtonLink>
      </div>
    </article>
  );
}
export function StatCard({
  label,
  value,
  icon,
  note,
}: {
  label: string;
  value: string;
  icon?: IconName;
  note?: string;
}) {
  return (
    <article className="stat-card">
      {icon && <IconTile name={icon} />}
      <strong>{value}</strong>
      <h3>{label}</h3>
      {note && <p>{note}</p>}
    </article>
  );
}
export function TestimonialCard({
  quote,
  person,
  role,
  verified = false,
}: {
  quote: string;
  person: string;
  role: string;
  verified?: boolean;
}) {
  return (
    <figure className="testimonial-card">
      <Quote size={28} aria-hidden="true" />
      {!verified && <Badge>Design sample · not a client statement</Badge>}
      <blockquote>{quote}</blockquote>
      <figcaption>
        <span className="avatar-placeholder">{person.charAt(0)}</span>
        <div>
          <strong>{person}</strong>
          <span>{role}</span>
        </div>
      </figcaption>
    </figure>
  );
}
