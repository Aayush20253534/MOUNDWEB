"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Handshake,
  Lightbulb,
  MessageCircle,
  Pause,
  PenLine,
  Play,
  Send,
  Sparkles,
} from "lucide-react";
import styles from "./contact-hero.module.css";

/** Illustrative inquiry preparation; no chat, delivery or availability is implied. */
export function ConversationStudio() {
  const scene = useRef<HTMLElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setEnabled(!preference.matches);
    const syncVisibility = () => setVisible(!document.hidden);
    syncPreference();
    syncVisibility();
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => setInView(Boolean(entry?.isIntersecting)),
            { threshold: 0.1 },
          )
        : null;
    if (scene.current) observer?.observe(scene.current);
    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer?.disconnect();
    };
  }, []);

  const motion = !enabled
    ? "static"
    : paused || !inView || !visible
      ? "paused"
      : "running";
  const ControlIcon = paused ? Play : Pause;

  return (
    <figure
      ref={scene}
      className={styles.studio}
      data-testid="conversation-studio"
      data-motion={motion}
    >
      <div className={styles.heading} aria-hidden="true">
        <MessageCircle /> THE CONVERSATION STARTER{" "}
        <span>IDEAS BECOME POSSIBILITIES</span>
      </div>
      <div
        className={styles.stage}
        role="img"
        aria-label="A draft inquiry opens into a conversation about brand growth, learning, college partnerships, or franchise partnerships with MOUNDWEB."
      >
        <div className={styles.art} aria-hidden="true">
          <div className={styles.halo} />
          <div className={styles.orbit} />
          <svg className={styles.connections} viewBox="0 0 600 520" fill="none">
            <path d="M130 210C204 210 214 280 300 280M110 348C208 348 214 300 300 300M490 226C425 226 411 280 315 280M490 410C403 410 430 310 315 310M130 85C240 10 388 70 463 130" />
            <path
              className={styles.signal}
              d="M130 210C204 210 214 280 300 280M110 348C208 348 214 300 300 300M490 226C425 226 411 280 315 280M490 410C403 410 430 310 315 310M130 85C240 10 388 70 463 130"
            />
          </svg>
          <div className={styles.question}>
            <MessageCircle />
            <div>
              <span>A QUESTION?</span>
              <strong>A good place to begin.</strong>
            </div>
            <div className={styles.thoughtDots}>
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className={styles.idea}>
            <Lightbulb />
            <div>
              <span>A BIGGER IDEA?</span>
              <strong>Put it into words.</strong>
            </div>
          </div>
          <div className={styles.plane}>
            <Send />
          </div>

          <div className={styles.envelope}>
            <div className={styles.envelopeBack} />
            <div className={styles.letter}>
              <div className={styles.letterHeading}>
                <PenLine />
                <span>YOUR INQUIRY</span>
                <b>DRAFT</b>
              </div>
              <strong>
                Hello,
                <br />
                <em>MOUNDWEB.</em>
              </strong>
              <p>Let’s talk about what’s next.</p>
              <div className={styles.writing}>
                <i />
                <i />
                <i />
              </div>
              <div className={styles.letterNote}>
                <Sparkles />
                <span>It starts with your idea.</span>
              </div>
            </div>
            <div className={styles.envelopeLeft} />
            <div className={styles.envelopeRight} />
            <div className={styles.envelopeFront} />
            <div className={styles.envelopeBrand}>
              <MessageCircle />
              <span>
                MOUND<span>WEB</span>
              </span>
            </div>
          </div>

          <div className={`${styles.topic} ${styles.growth}`}>
            <BriefcaseBusiness />
            <div>
              <strong>Brand growth</strong>
              <span>Explore your next move.</span>
            </div>
          </div>
          <div className={`${styles.topic} ${styles.learning}`}>
            <GraduationCap />
            <div>
              <strong>Learning journeys</strong>
              <span>Find a new direction.</span>
            </div>
          </div>
          <div className={`${styles.topic} ${styles.colleges}`}>
            <Building2 />
            <div>
              <strong>College partnerships</strong>
              <span>Learn. Connect. Collaborate.</span>
            </div>
          </div>
          <div className={`${styles.topic} ${styles.franchise}`}>
            <Handshake />
            <div>
              <strong>Franchise partnerships</strong>
              <span>Explore the possibilities.</span>
            </div>
          </div>
          <div className={styles.ideaTag}>
            <ArrowUpRight />
            <span>Small beginnings. New possibilities.</span>
          </div>
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span>Your next chapter starts with an idea.</span>
        <button
          className={styles.control}
          type="button"
          hidden={!enabled}
          onClick={() => setPaused((value) => !value)}
          aria-label={
            paused
              ? "Resume conversation animation"
              : "Pause conversation animation"
          }
        >
          <ControlIcon size={14} aria-hidden="true" />{" "}
          {paused ? "Resume" : "Pause"}
        </button>
      </figcaption>
    </figure>
  );
}
