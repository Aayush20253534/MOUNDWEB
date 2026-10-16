import { ArrowUpRight } from "lucide-react";
import { Eyebrow, Section } from "@/components/ui/primitives";

const phases = [
  {
    number: "01",
    title: "Understand",
    description: "Begin with the audience, the ambition, and the actual challenge.",
    focus: "Listen and explore",
  },
  {
    number: "02",
    title: "Create",
    description: "Shape a clear direction through strategy, ideas, and useful tools.",
    focus: "Design with purpose",
  },
  {
    number: "03",
    title: "Apply",
    description: "Put ideas into motion, whether through a campaign or a learning project.",
    focus: "Learn by doing",
  },
  {
    number: "04",
    title: "Evolve",
    description: "Review what works, refine the approach, and plan the next step.",
    focus: "Improve thoughtfully",
  },
] as const;

/** Conceptual approach, not an invented company history or dated achievement timeline. */
export function AboutJourney() {
  return (
    <Section className="about-journey about-reveal" aria-labelledby="about-journey-heading">
      <div className="about-journey-heading">
        <div>
          <Eyebrow>How we think</Eyebrow>
          <h2 id="about-journey-heading">
            Every next step has a <em>direction.</em>
          </h2>
        </div>
        <p>
          From brand strategy to professional learning, our approach starts
          with understanding and improves through action.
        </p>
      </div>
      <ol className="about-journey-steps" aria-label="Four parts of our approach">
        {phases.map((phase) => (
          <li className="about-journey-step about-animate-item" key={phase.number}>
            <div className="about-journey-node" aria-hidden="true">
              <span>{phase.number}</span>
            </div>
            <div className="about-journey-card">
              <span className="about-journey-focus">{phase.focus}</span>
              <h3>{phase.title}</h3>
              <p>{phase.description}</p>
              <ArrowUpRight size={17} aria-hidden="true" />
            </div>
          </li>
        ))}
      </ol>
      <p className="about-journey-disclaimer">
        An illustration of our guiding approach, not a claim of past results.
      </p>
    </Section>
  );
}
