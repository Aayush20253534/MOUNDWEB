"use client";

import { useEffect } from "react";

/**
 * About-only decorative motion. Content is fully visible without JS.
 * Intersection-triggered effects never depend on user data or fabricated counters.
 */
export function AboutMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hero = document.querySelector<HTMLElement>(".about-hero");
    const reveals = [
      ...document.querySelectorAll<HTMLElement>(
        ".about-reveal, .about-animate-item",
      ),
    ];
    let observer: IntersectionObserver | null = null;
    let heroObserver: IntersectionObserver | null = null;
    let heroVisible = true;
    let pendingFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const canAnimateHero = () =>
      !reduced.matches &&
      !document.hidden &&
      heroVisible &&
      hero?.dataset.heroPaused !== "true";
    const syncHeroActivity = () => {
      if (hero)
        hero.dataset.heroActive = String(
          !reduced.matches && !document.hidden && heroVisible,
        );
    };
    const resetParallax = () => {
      if (!hero) return;
      hero.style.removeProperty("--about-parallax-x");
      hero.style.removeProperty("--about-parallax-y");
    };
    const updateParallax = () => {
      pendingFrame = 0;
      if (!hero || !canAnimateHero()) return;
      hero.style.setProperty(
        "--about-parallax-x",
        (pointerX * 10).toFixed(2) + "px",
      );
      hero.style.setProperty(
        "--about-parallax-y",
        (pointerY * 8).toFixed(2) + "px",
      );
    };
    const pointerMove = (event: PointerEvent) => {
      if (!hero || event.pointerType === "touch" || !canAnimateHero()) return;
      const bounds = hero.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointerX = Math.max(
        -1,
        Math.min(1, (2 * (event.clientX - bounds.left)) / bounds.width - 1),
      );
      pointerY = Math.max(
        -1,
        Math.min(1, (2 * (event.clientY - bounds.top)) / bounds.height - 1),
      );
      if (!pendingFrame)
        pendingFrame = window.requestAnimationFrame(updateParallax);
    };
    const pointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      pendingFrame = window.requestAnimationFrame(updateParallax);
    };
    const startMotion = () => {
      if (reduced.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver(
        (entries, activeObserver) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const target = entry.target as HTMLElement;
            target.dataset.aboutMotion = "entered";
            activeObserver.unobserve(target);
          }
        },
        { rootMargin: "0px 0px -24px 0px", threshold: 0.08 },
      );
      for (const element of reveals) observer.observe(element);
    };
    const preferenceChange = () => {
      syncHeroActivity();
      observer?.disconnect();
      observer = null;
      if (reduced.matches) {
        for (const element of reveals) delete element.dataset.aboutMotion;
        resetParallax();
      } else startMotion();
    };
    hero?.addEventListener("pointermove", pointerMove, { passive: true });
    hero?.addEventListener("pointerleave", pointerLeave);
    document.addEventListener("visibilitychange", syncHeroActivity);
    reduced.addEventListener("change", preferenceChange);
    if (hero) {
      hero.dataset.heroReady = "true";
      syncHeroActivity();
      if ("IntersectionObserver" in window) {
        heroObserver = new IntersectionObserver(
          ([entry]) => {
            heroVisible = entry?.isIntersecting ?? false;
            syncHeroActivity();
          },
          { rootMargin: "80px" },
        );
        heroObserver.observe(hero);
      }
    }
    startMotion();
    return () => {
      observer?.disconnect();
      heroObserver?.disconnect();
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      hero?.removeEventListener("pointermove", pointerMove);
      hero?.removeEventListener("pointerleave", pointerLeave);
      reduced.removeEventListener("change", preferenceChange);
      document.removeEventListener("visibilitychange", syncHeroActivity);
      if (hero) {
        delete hero.dataset.heroReady;
        delete hero.dataset.heroActive;
        delete hero.dataset.heroPaused;
      }
      resetParallax();
      for (const element of reveals) delete element.dataset.aboutMotion;
    };
  }, []);
  return null;
}
