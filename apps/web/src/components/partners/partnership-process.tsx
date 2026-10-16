import { ArrowUpRight } from "lucide-react";
import { Eyebrow, Section } from "@/components/ui/primitives";
import type { PartnershipKind } from "@/lib/partnership-inquiry";

const steps = [
  { title: "Share your idea", text: "Outline the institution or region, the intended audience, and the collaboration you would like to explore." },
  { title: "Explore the fit", text: "Discuss a potential scope, capabilities, roles, and realistic expectations after live inquiries are enabled." },
  { title: "Confirm the terms", text: "Proceed only after mutual due diligence, eligibility checks, and independently agreed written terms." },
] as const;

export function PartnershipProcess({ kind }: { kind: PartnershipKind }) {
  return (
    <Section className="partner-process-section connection-reveal">
      <div className="partner-process-heading">
        <div><Eyebrow>The proposed pathway</Eyebrow><h2>A thoughtful way to <em>work together.</em></h2></div>
        <p>{kind === "colleges" ? "Institutional collaboration begins with learning needs and mutual fit." : "Exploring a franchise is a serious business discussion, not a guaranteed investment return."}</p>
      </div>
      <ol className="partner-process-list">
        {steps.map((step, index) => (
          <li className="partner-process-step" key={step.title}>
            <span className="partner-process-number">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <ArrowUpRight size={18} aria-hidden="true" />
          </li>
        ))}
      </ol>
      <p className="micro-note">Illustrative process only. No partnership is offered, approved, or finalized through this website.</p>
    </Section>
  );
}
