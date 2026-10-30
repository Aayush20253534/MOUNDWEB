import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { courses } from "@/lib/content";
import { getGuide } from "@/lib/course-guides";
import { CourseInterest } from "@/components/programs/course-interest";
import { ProgramMotion } from "@/components/programs/program-motion";
import { Accordion } from "@/components/ui/accordion";
import { BookOpen, Layers, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
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
  return { title: course ? course.title + " - " + course.category + " Learning Path" : "Program", description: course ? course.summary + " Explore the proposed curriculum and learning outcomes at MOUNDWEB." : undefined, alternates: course ? { canonical: "/programs/" + slug } : undefined };
}
export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();
  const guide = getGuide(course);
  const categoryAnchor = course.category === "Digital Marketing" ? "digital-marketing" : "web-development";
  return (
    <>
      <ProgramMotion />
      <Container>
        <Breadcrumbs
          items={[
            { label: "Our Programs", href: "/programs" },
            { label: course.title },
          ]}
        />
      </Container>
      <Section className="course-detail-section">
        <div className="course-detail-grid">
          <div>
            <Eyebrow>{course.category} · {guide.level} learning path</Eyebrow>
            <h1>{course.title}</h1>
            <p className="body-copy">{course.summary}</p>
            <div className="course-tags">
              <Badge>{course.duration ?? "Duration to be confirmed"}</Badge>
              <Badge>Draft program outline</Badge>
            </div>
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
            <div className="course-outcome-grid program-reveal">
              <article className="course-info-panel">
                <BookOpen size={23} aria-hidden="true" />
                <h3>Who this may suit</h3>
                <p>{guide.audience}</p>
                <h3>Suggested prerequisites</h3>
                <p>{guide.prerequisites}</p>
              </article>
              <article className="course-info-panel">
                <Layers size={23} aria-hidden="true" />
                <h3>Sample practical project</h3>
                <p>{guide.sampleProject}</p>
              </article>
            </div>
            <section className="course-curriculum program-reveal" aria-labelledby="course-curriculum-title">
              <Eyebrow>Draft learning outline</Eyebrow>
              <h2 id="course-curriculum-title">Explore the <em>modules.</em></h2>
              <p className="body-copy">These are proposed topics for guidance only, not a finalized syllabus.</p>
              <Accordion items={guide.modules.map((unit, index) => ({
                question: "Module " + String(index + 1).padStart(2, "0") + " · " + unit.title,
                answer: unit.topics.join(" · "),
              }))} />
            </section>
            <section className="course-outcomes program-reveal" aria-labelledby="course-outcomes-title">
              <Eyebrow>Possible learning goals</Eyebrow>
              <h2 id="course-outcomes-title">What you could <em>explore.</em></h2>
              <ul className="course-outcome-list">
                {guide.outcomes.map((item) => (
                  <li key={item}><Check size={16} aria-hidden="true" />{item}</li>
                ))}
              </ul>
            </section>
            <Link className="text-link course-back-link" href={"/programs#" + categoryAnchor}>
              <ArrowLeft size={17} aria-hidden="true" /> Back to {course.category}
            </Link>
          </div>
          <aside className="course-details course-admissions">
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
                <dt>Suggested level</dt>
                <dd>{guide.level}</dd>
              </div>
              <div>
                <dt>Eligibility</dt>
                <dd>To be confirmed</dd>
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
                <dt>Admission status</dt>
                <dd>Information requests only</dd>
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
            <CourseInterest course={course} />
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
