"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Bookmark,
  Compass,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pause,
  PenTool,
  Play,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import styles from "./services-hero.module.css";

export function GrowthStudio() {
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
      data-testid="growth-studio"
      data-motion={motion}
    >
      <div className={styles.heading} aria-hidden="true">
        <i /> THE GROWTH STUDIO <span>BUILT AROUND YOUR BRAND</span>
      </div>
      <div
        className={styles.stage}
        role="img"
        aria-label="A brand at the centre of six connected marketing disciplines: SEO, social media, performance marketing, content and creative, brand identity, and growth strategy."
      >
        <div className={styles.art} aria-hidden="true">
          <div className={styles.orbit} />
          <div className={styles.outerOrbit} />
          <div className={styles.wave} />
          <div className={styles.secondWave} />
          <svg className={styles.connections} viewBox="0 0 600 520" fill="none">
            <path d="M275 254C206 254 218 165 130 165M300 235C300 170 359 113 455 113M320 285C410 285 373 398 478 398M270 290C220 345 162 383 107 400M315 220C330 165 287 81 260 70M270 270C210 290 119 292 90 292" />
            <path
              className={styles.signal}
              d="M275 254C206 254 218 165 130 165M300 235C300 170 359 113 455 113M320 285C410 285 373 398 478 398M270 290C220 345 162 383 107 400M315 220C330 165 287 81 260 70M270 270C210 290 119 292 90 292"
            />
          </svg>

          <div className={styles.brandCore}>
            <span className={styles.coreLabel}>AT THE CENTRE</span>
            <div className={styles.brandMark}>
              <svg viewBox="0 0 80 80" fill="none">
                <path
                  d="M40 10V70M10 40H70M19 19L61 61M19 61L61 19"
                  stroke="currentColor"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
                <circle cx="40" cy="40" r="12" fill="currentColor" />
              </svg>
            </div>
            <strong>Your brand.</strong>
            <span className={styles.coreNote}>One connected vision.</span>
          </div>

          <div className={styles.searchPanel}>
            <div className={styles.panelLabel}>
              <Search />
              <span>SEARCH & DISCOVERY</span>
            </div>
            <div className={styles.searchBox}>
              <Search />
              <span>Make your brand discoverable</span>
              <i />
            </div>
            <div className={styles.searchResult}>
              <span className={styles.resultIcon}>
                <Sparkles />
              </span>
              <div>
                <span>YOUR BRAND</span>
                <strong>Be part of the search.</strong>
                <i />
                <i />
              </div>
            </div>
            <span className={styles.panelTag}>SEO</span>
          </div>

          <div className={styles.socialPanel}>
            <div className={styles.socialHeader}>
              <span className={styles.avatar}>
                <Sparkles />
              </span>
              <span>
                your.brand<small>Made for your audience</small>
              </span>
              <MoreHorizontal />
            </div>
            <div className={styles.postArtwork}>
              <span>
                MAKE A<br />
                <b>CONNECTION.</b>
              </span>
              <div className={styles.postShape} />
              <div className={styles.postRing} />
              <ArrowUpRight />
            </div>
            <div className={styles.socialActions}>
              <Heart className={styles.heart} />
              <MessageCircle />
              <Send />
              <Bookmark />
            </div>
            <div className={styles.postCaption}>
              <i />
              <i />
            </div>
            <span className={styles.panelTag}>SOCIAL MEDIA</span>
          </div>

          <div className={styles.performancePanel}>
            <div className={styles.panelLabel}>
              <ArrowUpRight />
              <span>PERFORMANCE MARKETING</span>
            </div>
            <strong>Every move, considered.</strong>
            <div className={styles.chart}>
              <svg viewBox="0 0 220 74" fill="none">
                <path
                  className={styles.chartGrid}
                  d="M0 12H220M0 37H220M0 62H220"
                />
                <path
                  className={styles.chartArea}
                  d="M4 63C22 63 25 42 43 48S69 58 87 34S112 49 137 24S170 38 189 15S206 12 216 4V74H4Z"
                />
                <path
                  className={styles.chartLine}
                  pathLength="1"
                  d="M4 63C22 63 25 42 43 48S69 58 87 34S112 49 137 24S170 38 189 15S206 12 216 4"
                />
              </svg>
            </div>
            <div className={styles.measurement}>
              <span>Plan</span>
              <i />
              <span>Test</span>
              <i />
              <span>Refine</span>
            </div>
          </div>

          <div className={styles.identityChip}>
            <span>Aa</span>
            <div>
              <strong>Brand identity</strong>
              <small>Make it recognisable.</small>
            </div>
            <div className={styles.swatches}>
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className={styles.strategyChip}>
            <Compass />
            <span>Growth strategy</span>
          </div>
          <div className={styles.creativeChip}>
            <PenTool />
            <span>Content & creative</span>
          </div>
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span>Different channels. One clear direction.</span>
        <button
          className={styles.control}
          type="button"
          hidden={!enabled}
          onClick={() => setPaused((value) => !value)}
          aria-label={
            paused
              ? "Resume brand growth animation"
              : "Pause brand growth animation"
          }
        >
          <ControlIcon size={14} aria-hidden="true" />{" "}
          {paused ? "Resume" : "Pause"}
        </button>
      </figcaption>
    </figure>
  );
}
