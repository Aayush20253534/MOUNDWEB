"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Shared route-arrival motion. Page-specific scenes keep their own timing.
 * A short Web Animations API effect is used only for ordinary motion settings.
 */
export function SiteMotion() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    const before = previous.current;
    previous.current = pathname;
    if (before === null || before === pathname) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const main = document.getElementById("main-content");
    if (!main || typeof main.animate !== "function") return;

    main.dataset.routeTransition = "entering";
    const animation = main.animate(
      [
        { opacity: 0.94, transform: "translate3d(0, 5px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: 260,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "none",
      },
    );
    const finish = () => {
      if (main.dataset.routeTransition === "entering") {
        delete main.dataset.routeTransition;
      }
    };
    animation.addEventListener("finish", finish, { once: true });
    animation.addEventListener("cancel", finish, { once: true });
    return () => {
      animation.cancel();
      finish();
    };
  }, [pathname]);

  return null;
}
