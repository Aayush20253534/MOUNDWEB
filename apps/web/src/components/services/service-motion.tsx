"use client";

import { useEffect } from "react";

/**
 * Progressive enhancement for Services and related landing pages.
 * Keeps all text visible on first paint and without JavaScript.
 */
export function ServiceMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sections = [...document.querySelectorAll<HTMLElement>(".service-reveal")];
    let observer: IntersectionObserver | null = null;
    const start = () => {
      if (reduced.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver((entries, active) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.serviceMotion = "entered";
          active.unobserve(entry.target);
        }
      }, { threshold: 0.07, rootMargin: "0px 0px -22px 0px" });
      sections.forEach((section) => observer?.observe(section));
    };
    const onPreference = () => {
      observer?.disconnect();
      observer = null;
      if (reduced.matches) {
        sections.forEach((section) => delete section.dataset.serviceMotion);
      } else start();
    };
    reduced.addEventListener("change", onPreference);
    start();
    return () => {
      observer?.disconnect();
      reduced.removeEventListener("change", onPreference);
      sections.forEach((section) => delete section.dataset.serviceMotion);
    };
  }, []);
  return null;
}
