import { PageHero } from "./page-hero";
import {
  ButtonLink,
  EmptyState,
  Section,
  SectionHeading,
} from "../ui/primitives";
import { EditorialLink, CTASection } from "./shared";
import type { IconName } from "@/lib/content";

export type EditorialContent = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  icon: IconName;
  emptyTitle: string;
  emptyText: string;
  note: string;
  links: { title: string; text: string; href: string }[];
};
export function EditorialTemplate({ content }: { content: EditorialContent }) {
  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        title={
          <>
            {content.title}
            <br />
            <em>{content.accent}</em>
          </>
        }
        description={content.description}
        image="mountain-panorama"
      >
        <ButtonLink href="/contact">Start a conversation</ButtonLink>
      </PageHero>
      <Section>
        <SectionHeading
          eyebrow="The next chapter"
          title="A space for what comes next."
          description={content.note}
        />
        <EmptyState icon={content.icon} title={content.emptyTitle}>
          {content.emptyText}
        </EmptyState>
      </Section>
      <Section>
        <SectionHeading
          eyebrow="Keep exploring"
          title={
            <>
              Find your <em>next direction.</em>
            </>
          }
        />
        <div className="editorial-grid">
          {content.links.map((link) => (
            <EditorialLink key={link.href} {...link} />
          ))}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
