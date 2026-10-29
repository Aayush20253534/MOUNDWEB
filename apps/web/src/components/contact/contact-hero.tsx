import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
} from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { ConversationStudio } from "./conversation-studio";
import styles from "./contact-hero.module.css";

export function ContactHero() {
  return (
    <section
      className={`contact-hero ${styles.hero}`}
      aria-labelledby="contact-heading"
    >
      <Container className={styles.layout}>
        <div className={styles.copy}>
          <Eyebrow>Contact us</Eyebrow>
          <h1 id="contact-heading">
            Let’s start the
            <br />
            <em>conversation.</em>
          </h1>
          <p className={styles.description}>
            A question, a fresh idea, or a bigger ambition. Find your starting
            point with MOUNDWEB—whether you’re building a brand, exploring a
            program, or considering a partnership.
          </p>
          <div className={styles.actions}>
            <a className="button button--primary" href="#inquiry">
              Prepare an inquiry <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a className={styles.explore} href="#conversation-paths">
              Find your starting point{" "}
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <ul
            className={styles.audiences}
            aria-label="Who can connect with MOUNDWEB"
          >
            <li>
              <BriefcaseBusiness size={17} aria-hidden="true" /> Brands
            </li>
            <li>
              <GraduationCap size={17} aria-hidden="true" /> Learners
            </li>
            <li>
              <Handshake size={17} aria-hidden="true" /> Partners
            </li>
          </ul>
        </div>
        <ConversationStudio />
      </Container>
      <Container>
        <div className={styles.footer}>
          <span>EVERY CONNECTION STARTS SOMEWHERE.</span>
          <p>Bring your question. Begin with an idea.</p>
          <ArrowDown size={18} aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}
