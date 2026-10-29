"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Code2,
  Layers3,
  MousePointer2,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
import styles from "./program-hero.module.css";

/** Original HTML/CSS artwork, rendered statically until motion is enabled. */
export function ProgramStudio() {
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
      data-testid="program-studio"
      data-motion={motion}
    >
      <div className={styles.studioHeading} aria-hidden="true">
        <span className={styles.statusDot} /> THE LEARNING STUDIO
        <span>IDEA → CREATION</span>
      </div>
      <div
        className={styles.stage}
        role="img"
        aria-label="Code becomes a website, creative ideas become a campaign, and AI tools connect the learning process."
      >
        <div className={styles.art} aria-hidden="true">
          <div className={styles.halo} />
          <svg className={styles.connections} viewBox="0 0 600 520" fill="none">
            <path d="M110 122H262Q290 122 290 150V230M472 94V160Q472 180 452 180H385M155 402H262Q290 402 290 374V330M402 335H480V422" />
            <path
              className={styles.signal}
              d="M110 122H262Q290 122 290 150V230M472 94V160Q472 180 452 180H385M155 402H262Q290 402 290 374V330M402 335H480V422"
            />
          </svg>

          <div className={styles.browser}>
            <div className={styles.browserBar}>
              <span className={styles.windowDots}>
                <i />
                <i />
                <i />
              </span>
              <span>your-next-idea.web</span>
              <ArrowUpRight />
            </div>
            <div className={styles.website}>
              <div className={styles.siteNav}>
                <span>
                  <Layers3 /> CREATE.
                </span>
                <i />
                <i />
              </div>
              <div className={styles.siteContent}>
                <div className={styles.siteCopy}>
                  <span className={styles.miniEyebrow}>MADE BY YOU</span>
                  <strong>
                    Small idea.
                    <br />
                    <em>Big possibility.</em>
                  </strong>
                  <div className={styles.skeleton}>
                    <i />
                    <i />
                  </div>
                  <span className={styles.siteButton}>
                    Let’s create <ArrowUpRight />
                  </span>
                </div>
                <div className={styles.visual}>
                  <div className={styles.orbit} />
                  <div className={styles.creativeTile}>
                    <Sparkles />
                  </div>
                  <span className={styles.visualDot} />
                  <span className={styles.visualSquare} />
                </div>
              </div>
              <div className={styles.siteCards}>
                <div>
                  <Code2 />
                  <i />
                  <i />
                </div>
                <div>
                  <Layers3 />
                  <i />
                  <i />
                </div>
                <div>
                  <Sparkles />
                  <i />
                  <i />
                </div>
              </div>
            </div>
            <MousePointer2 className={styles.cursor} fill="currentColor" />
          </div>

          <div className={styles.codePanel}>
            <div className={styles.panelHeader}>
              <Code2 />
              <span>BUILD SOMETHING</span>
              <span className={styles.fileType}>html</span>
            </div>
            <div className={styles.codeLines}>
              <div>
                <span>01</span>
                <code>
                  &lt;<b>idea</b>&gt;
                </code>
              </div>
              <div>
                <span>02</span>
                <code>
                  &nbsp; learn(<em>"by doing"</em>);
                </code>
              </div>
              <div>
                <span>03</span>
                <code>
                  &nbsp; create(<em>something</em>);
                </code>
              </div>
              <div>
                <span>04</span>
                <code>
                  &lt;/<b>idea</b>&gt;
                </code>
              </div>
            </div>
            <div className={styles.codeFooter}>
              <span /> Curiosity in. Creativity out.
            </div>
          </div>

          <div className={styles.campaignPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.campaignIcon}>
                <ArrowUpRight />
              </span>
              <span>CAMPAIGN LAB</span>
              <Sparkles />
            </div>
            <strong>Ideas that connect.</strong>
            <div className={styles.chart}>
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className={styles.campaignTags}>
              <span>Content</span>
              <span>Strategy</span>
              <span>Reach</span>
            </div>
          </div>

          <div className={styles.aiBadge}>
            <Sparkles />
            <div>
              <strong>A little AI.</strong>
              <span>A lot of possibility.</span>
            </div>
          </div>
          <div className={styles.projectBadge}>
            <span>
              <Check />
            </span>
            Made to make things.
          </div>
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span>Learn it. Try it. Bring it to life.</span>
        <button
          type="button"
          className={styles.motionControl}
          hidden={!enabled}
          onClick={() => setPaused((value) => !value)}
          aria-label={
            paused
              ? "Resume learning studio animation"
              : "Pause learning studio animation"
          }
        >
          <ControlIcon size={14} aria-hidden="true" />{" "}
          {paused ? "Resume" : "Pause"}
        </button>
      </figcaption>
    </figure>
  );
}
