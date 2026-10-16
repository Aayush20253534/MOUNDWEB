"use client";

import { useEffect } from "react";

/** Motion never gates content visibility or requests user data. */
export function EditorialMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const targets = document.querySelectorAll<HTMLElement>(".editorial-reveal");
    const observer = new IntersectionObserver((entries, current) => {
      for (const entry of entries) if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.editorialMotion = "entered";
        current.unobserve(entry.target);
      }
    }, { threshold: .06, rootMargin: "0px 0px -24px 0px" });
    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      targets.forEach((target) => delete target.dataset.editorialMotion);
    };
  }, []);
  return null;
}
