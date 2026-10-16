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
    const hero = document.querySelector<HTMLElement>(".services-hero");
    let observer: IntersectionObserver | null = null;
    let frame = 0;
    const setPointer = (event: PointerEvent) => {
      if (!hero || reduced.matches || event.pointerType === "touch") return;
      const bounds = hero.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 20;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 15;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        hero.style.setProperty("--service-pointer-x", x.toFixed(2) + "px");
        hero.style.setProperty("--service-pointer-y", y.toFixed(2) + "px");
        frame = 0;
      });
    };
    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      hero?.style.removeProperty("--service-pointer-x");
      hero?.style.removeProperty("--service-pointer-y");
    };
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
        reset();
      } else start();
    };
    hero?.addEventListener("pointermove", setPointer, { passive: true });
    hero?.addEventListener("pointerleave", reset);
    reduced.addEventListener("change", onPreference);
    start();
    return () => {
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
      hero?.removeEventListener("pointermove", setPointer);
      hero?.removeEventListener("pointerleave", reset);
      reduced.removeEventListener("change", onPreference);
      reset();
      sections.forEach((section) => delete section.dataset.serviceMotion);
    };
  }, []);
  return null;
}
