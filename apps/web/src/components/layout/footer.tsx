import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";
import { Container } from "../ui/primitives";
import { services } from "@/lib/content";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand />
            <p>
              Building brands. <br />
              Growing skills. <br />
              Creating what comes next.
            </p>
            <span className="footer-signature">
              <span /> Growth begins here.
            </span>
          </div>
          <div>
            <h2>Explore</h2>
            <ul>
              {[
                ["Home", "/"],
                ["About", "/about"],
                ["Our Programs", "/programs"],
                ["Podcast", "/podcast"],
                ["Media", "/media"],
                ["Career", "/career"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href!}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Our services</h2>
            <ul>
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services#${service.slug}`}>
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services#advertising">
                  Advertising <span className="quiet">· Soon</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-connect">
            <h2>A bigger idea in mind?</h2>
            <p>
              For your brand, your learning journey, or your next partnership.
            </p>
            <Link className="footer-contact-link" href="/contact">
              Let’s connect <ArrowUpRight size={21} aria-hidden="true" />
            </Link>
            <Link href="/training-placements" className="footer-extra">
              Training & Placements
            </Link>
            <Link href="/partners" className="footer-extra">
              Partner With Us
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MOUNDWEB. All rights reserved.</p>
          <div>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms & conditions</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
