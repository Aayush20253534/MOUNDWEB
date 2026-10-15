import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { courses } from "@/lib/content";
import {
  Container,
  Breadcrumbs,
  Section,
  Eyebrow,
  Badge,
  ButtonLink,
} from "@/components/ui/primitives";
import { CTASection, CheckList } from "@/components/sections/shared";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  return { title: course?.title ?? "Program", description: course?.summary };
}
export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();
  return (
    <>
      <Container>
        <Breadcrumbs
          items={[
            { label: "Our Programs", href: "/programs" },
            { label: course.title },
          ]}
        />
      </Container>
      <Section>
        <div className="course-detail-grid">
          <div>
            <Eyebrow>{course.category} · Learning path</Eyebrow>
            <h1>{course.title}</h1>
            <p className="body-copy">{course.summary}</p>
            <div className="detail-copy">
              <Image
                className="course-detail-image"
                src={`/assets/courses/${course.image}.webp`}
                width={960}
                height={640}
                alt={`Concept illustration for the ${course.title} course`}
                priority
              />
              <div className="detail-copy">
                <Badge>Proposed outline · subject to confirmation</Badge>
                <h2 className="mt-6">
                  A starting point for <em>your learning.</em>
                </h2>
                <p className="body-copy">
                  Explore the following focus areas. The final curriculum,
                  learning format, admission requirements, and assessment
                  details will be confirmed before enrollment.
                </p>
                <CheckList items={course.focus} />
              </div>
            </div>
          </div>
          <aside className="course-details">
            <Eyebrow>Program overview</Eyebrow>
            <h2>Your next chapter</h2>
            <dl>
              <div>
                <dt>Learning path</dt>
                <dd>{course.category}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{course.duration ?? "To be confirmed"}</dd>
              </div>
              <div>
                <dt>Delivery format</dt>
                <dd>To be confirmed</dd>
              </div>
              <div>
                <dt>Fees & start date</dt>
                <dd>To be confirmed</dd>
              </div>
              <div>
                <dt>Curriculum</dt>
                <dd>Draft outline</dd>
              </div>
            </dl>
            <ButtonLink
              href={`/contact?type=course&subject=${encodeURIComponent(course.title)}#inquiry`}
            >
              Ask about this program
            </ButtonLink>
            <p className="micro-note">
              This page is an information preview, not an enrollment offer. No
              placement or employment outcome is guaranteed.
            </p>
            {course.slug === "ai-digital-ninja" && (
              <p className="micro-note">
                Parents or guardians should request age eligibility, delivery,
                supervision, and consent details before enrollment.
              </p>
            )}
          </aside>
        </div>
      </Section>
      <CTASection
        title={
          <>
            Your curiosity.
            <br />
            <em>A new direction.</em>
          </>
        }
        primaryLabel="Explore all programs"
        href="/programs"
      />
    </>
  );
}
