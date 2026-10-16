"use client";

import { useEffect } from "react";

/** Progressive enhancement: animation never hides server-rendered course content. */
export function ProgramMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries, instance) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.programMotion = "entered";
        instance.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
    const targets = document.querySelectorAll<HTMLElement>(".program-reveal");
    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      targets.forEach((target) => delete target.dataset.programMotion);
    };
  }, []);
  return null;
}
