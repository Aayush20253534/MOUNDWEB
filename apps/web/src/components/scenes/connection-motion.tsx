"use client";

import { useEffect } from "react";

/** Decorative progressive enhancement for Contact and Partnerships pages. */
export function ConnectionMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sections = document.querySelectorAll<HTMLElement>(".connection-reveal");
    const hero = document.querySelector<HTMLElement>(".connection-hero");
    let observer: IntersectionObserver | undefined;
    let pending = 0;
    const pointerMove = (event: PointerEvent) => {
      if (!hero || reduced.matches || event.pointerType === "touch") return;
      const rect = hero.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      if (pending) cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => {
        hero.style.setProperty("--connection-x", (x * 18).toFixed(1) + "px");
        hero.style.setProperty("--connection-y", (y * 14).toFixed(1) + "px");
        pending = 0;
      });
    };
    const reset = () => {
      if (pending) cancelAnimationFrame(pending);
      pending = 0;
      hero?.style.removeProperty("--connection-x");
      hero?.style.removeProperty("--connection-y");
    };
    const start = () => {
      if (reduced.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver((entries, instance) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.connectionMotion = "entered";
          instance.unobserve(entry.target);
        }
      }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
      sections.forEach((element) => observer?.observe(element));
    };
    const change = () => {
      observer?.disconnect();
      observer = undefined;
      if (reduced.matches) {
        sections.forEach((element) => delete element.dataset.connectionMotion);
        reset();
      } else start();
    };
    hero?.addEventListener("pointermove", pointerMove, { passive: true });
    hero?.addEventListener("pointerleave", reset);
    reduced.addEventListener("change", change);
    start();
    return () => {
      observer?.disconnect();
      if (pending) cancelAnimationFrame(pending);
      hero?.removeEventListener("pointermove", pointerMove);
      hero?.removeEventListener("pointerleave", reset);
      reduced.removeEventListener("change", change);
      reset();
      sections.forEach((element) => delete element.dataset.connectionMotion);
    };
  }, []);
  return null;
}
