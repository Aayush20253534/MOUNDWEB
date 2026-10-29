import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { ProgramStudio } from "./program-studio";
import styles from "./program-hero.module.css";

export function ProgramHero() {
  return (
    <section
      className={`programs-hero ${styles.hero}`}
      aria-labelledby="programs-heading"
    >
      <Container className={styles.layout}>
        <div className={styles.copy}>
          <Eyebrow>Our programs</Eyebrow>
          <h1 id="programs-heading">
            Learn the skills.
            <br />
            Build <em>what’s next.</em>
          </h1>
          <p className={styles.description}>
            Turn your curiosity into something you can create. Explore Digital
            Marketing and Web Development through code, content, campaigns, and
            AI.
          </p>
          <div className={styles.actions}>
            <a className="button button--primary" href="#learning-paths">
              Explore programs <ArrowDown size={17} aria-hidden="true" />
            </a>
            <Link className={styles.approach} href="/training-placements">
              Our learning approach{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <ul className={styles.skills} aria-label="Areas of learning">
            <li>
              <Code2 size={17} aria-hidden="true" /> Development
            </li>
            <li>
              <Megaphone size={17} aria-hidden="true" /> Marketing
            </li>
            <li>
              <Sparkles size={17} aria-hidden="true" /> AI tools
            </li>
          </ul>
        </div>
        <ProgramStudio />
      </Container>
      <Container>
        <div className={styles.footer}>
          <span>AN IDEA IS ONLY THE BEGINNING.</span>
          <p>Explore it. Make it. Make it better.</p>
          <ArrowDown size={18} aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}
