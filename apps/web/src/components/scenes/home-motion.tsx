"use client";

import { useEffect } from "react";

/** Native IntersectionObserver avoids JS animation frameworks and preserves SSR/no-JS content. */
export function HomeMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = [...document.querySelectorAll<HTMLElement>(".home-motion")];
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.homeMotion = "entered";
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    for (const target of targets) {
      target.dataset.homeMotion = "waiting";
      observer.observe(target);
    }
    return () => {
      observer.disconnect();
      for (const target of targets) delete target.dataset.homeMotion;
    };
  }, []);
  return null;
}
