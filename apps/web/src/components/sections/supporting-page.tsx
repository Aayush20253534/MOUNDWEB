import type { Metadata } from "next";
import {
  EditorialTemplate,
  type EditorialContent,
} from "@/components/sections/editorial-template";
import {
  Section,
  Eyebrow,
  Badge,
  ButtonLink,
} from "@/components/ui/primitives";

type EditorialSection = "podcast" | "media" | "career" | "training-placements";
export type SupportingSection = EditorialSection | "privacy" | "terms";

const sharedLinks = [
  {
    title: "Our programs",
    text: "Explore Digital Marketing and Web Development learning paths.",
    href: "/programs",
  },
  {
    title: "Our services",
    text: "Discover a connected approach to brand growth.",
    href: "/services",
  },
  {
    title: "Partner with us",
    text: "Bring learning, industry, and opportunity closer together.",
    href: "/partners",
  },
];
const pages: Record<EditorialSection, EditorialContent> = {
  podcast: {
    eyebrow: "MOUNDWEB podcast",
    title: "Good questions.",
    accent: "New perspectives.",
    description:
      "A place for conversations about brands, creativity, learning, and the changing digital world.",
    icon: "play",
    emptyTitle: "Our first conversations are coming.",
    emptyText:
      "Episodes will be listed here when they are recorded and ready to share. There are no published episodes yet.",
    note: "Future episodes will include a title, guest details, duration, accessible transcript, and a working player.",
    links: sharedLinks,
  },
  media: {
    eyebrow: "MOUNDWEB media",
    title: "Ideas worth",
    accent: "passing on.",
    description:
      "Perspectives on digital growth, useful skills, and the work that connects them.",
    icon: "pen",
    emptyTitle: "The journal is taking shape.",
    emptyText:
      "Approved articles, announcements, and media resources will appear here. No sample coverage is presented as published news.",
    note: "This editorial space is ready for verified articles, dated updates, and original media.",
    links: sharedLinks,
  },
  career: {
    eyebrow: "Careers at MOUNDWEB",
    title: "Do thoughtful work.",
    accent: "Build what’s next.",
    description:
      "Strategy, creativity, education, and a shared curiosity about what could be better.",
    icon: "briefcase",
    emptyTitle: "No confirmed openings are listed yet.",
    emptyText:
      "Verified opportunities will include a role description, work location, requirements, and an application process. No sample vacancy is accepting applications.",
    note: "We’ll publish opportunities here when the roles and hiring details are confirmed.",
    links: sharedLinks,
  },
  "training-placements": {
    eyebrow: "Training & placements",
    title: "Progress that",
    accent: "can be understood.",
    description:
      "A transparent view of learning journeys and career opportunities, grounded in verified information.",
    icon: "cap",
    emptyTitle: "Verified records are being prepared.",
    emptyText:
      "Training and placement records will appear with confirmed reporting periods, clear definitions, and consent. No employment guarantee or placement count is claimed.",
    note: "Future records must distinguish enrollment, completion, placement assistance, and verified employment outcomes.",
    links: sharedLinks,
  },
};
export function supportingMetadata(section: SupportingSection): Metadata {
  return {
    title:
      section === "privacy"
        ? "Privacy policy"
        : section === "terms"
          ? "Terms & conditions"
          : pages[section].eyebrow,
    robots: { index: false, follow: true },
  };
}
export function SupportingPage({ section }: { section: SupportingSection }) {
  if (section === "privacy" || section === "terms")
    return (
      <Section>
        <div className="legal-content">
          <Eyebrow>MOUNDWEB</Eyebrow>
          <h1>
            {section === "privacy" ? "Privacy policy" : "Terms & conditions"}
          </h1>
          <div className="mt-6">
            <Badge>Publication pending</Badge>
          </div>
          <p>
            The approved{" "}
            {section === "privacy" ? "privacy policy" : "terms and conditions"}{" "}
            will be published before live inquiries, applications, or enrollment
            are enabled.
          </p>
          <h2>Current preview</h2>
          <p>
            The inquiry form currently validates and displays the information
            you enter locally in your browser. It does not send an inquiry to
            MOUNDWEB, save a record, or subscribe you to marketing.
          </p>
          <p>
            Program outlines, commercial details, contact information, and
            outcome records that have not been confirmed are marked as pending.
            No payments or enrollment commitments can be made through this
            preview.
          </p>
          <ButtonLink href="/contact" variant="secondary">
            Back to contact
          </ButtonLink>
        </div>
      </Section>
    );
  const content = pages[section];
  return <EditorialTemplate content={content} />;
}
