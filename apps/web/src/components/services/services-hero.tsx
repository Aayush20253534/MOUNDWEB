import {
  ArrowDown,
  ArrowUpRight,
  Compass,
  PenTool,
  TrendingUp,
} from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { GrowthStudio } from "./growth-studio";
import styles from "./services-hero.module.css";

export function ServicesHero() {
  return (
    <section
      className={`services-hero ${styles.hero}`}
      aria-labelledby="services-heading"
    >
      <Container className={styles.layout}>
        <div className={styles.copy}>
          <Eyebrow>Our services</Eyebrow>
          <h1 id="services-heading">
            Your brand.
            <br />A <em>clearer direction.</em>
          </h1>
          <p className={styles.description}>
            Bring your brand, your audience, and your next move together.
            Connect search, social, creative, and performance through a strategy
            shaped around you.
          </p>
          <div className={styles.actions}>
            <a
              className="button button--primary"
              href="/contact?type=growth#inquiry"
            >
              Discuss your project <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a className={styles.explore} href="#growth-services">
              Explore services <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <ul
            className={styles.disciplines}
            aria-label="Our approach to brand growth"
          >
            <li>
              <Compass size={17} aria-hidden="true" /> Strategy
            </li>
            <li>
              <PenTool size={17} aria-hidden="true" /> Creative
            </li>
            <li>
              <TrendingUp size={17} aria-hidden="true" /> Performance
            </li>
          </ul>
        </div>
        <GrowthStudio />
      </Container>
      <Container>
        <div className={styles.footer}>
          <span>ONE BRAND. CONNECTED THINKING.</span>
          <p>Find the direction. Create the connection.</p>
          <a href="#process">
            Our process <ArrowDown size={15} aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  );
}
