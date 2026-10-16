"use client";

import { useEffect, useRef } from "react";
import type { MountainPhase } from "./scene-contracts";
import type { createMountainWebGL } from "./mountain-webgl";

type Controller = ReturnType<typeof createMountainWebGL>;

/** Client-only GPU activation; the server-rendered landscape remains the fallback. */
export function MountainRuntime() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = host.current;
    const stage = target?.closest<HTMLElement>(".mountain-stage");
    if (!target || !stage) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (motion.matches || connection?.saveData) return;
    let cancelled = false;
    let visible = false;
    let initializing = false;
    let controller: Controller | null = null;
    const onPhase = (phase: MountainPhase) => { stage.dataset.phase = phase; };
    const eligible = () => visible && !document.hidden && !motion.matches;
    const stop = () => { controller?.pause(); };
    async function activate() {
      if (!eligible() || cancelled) { stop(); return; }
      if (controller) { controller.resume(); return; }
      if (initializing) return;
      initializing = true;
      const canvas = document.createElement("canvas");
      canvas.className = "mountain-webgl-canvas";
      canvas.setAttribute("aria-hidden", "true");
      canvas.setAttribute("role", "presentation");
      try {
        const renderer = await import("./mountain-webgl");
        if (cancelled || !eligible()) return;
        target.appendChild(canvas);
        const low = window.innerWidth < 800 ||
          (navigator.hardwareConcurrency ?? 4) <= 4;
        controller = renderer.createMountainWebGL(canvas, onPhase, low ? "low" : "high");
      } catch {
        canvas.remove();
        stage.dataset.phase = "poster";
      } finally {
        initializing = false;
      }
    }
    const intersection = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (eligible()) void activate();
      else stop();
    }, { rootMargin: "120px", threshold: 0 });
    intersection.observe(stage);
    const onVisibility = () => {
      if (eligible()) void activate();
      else stop();
    };
    const onMotion = () => {
      if (motion.matches) {
        stop();
        stage.dataset.phase = "poster";
        target.querySelector("canvas")?.remove();
        controller?.dispose();
        controller = null;
      } else if (eligible()) void activate();
    };
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", onMotion);
    return () => {
      cancelled = true;
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", onMotion);
      controller?.dispose();
      target.querySelector("canvas")?.remove();
    };
  }, []);
  return <div className="mountain-scene-runtime" ref={host} aria-hidden="true" />;
}
