"use client";

import { useEffect, useRef } from "react";
import type { GlobeController } from "./globe-webgl";

/** Activates the real sphere only while visible. The server-rendered globe is always the fallback. */
export function GlobeRuntime() {
  const hostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = hostRef.current;
    const parent = host?.closest<HTMLElement>(".globe-stage");
    if (!host || !parent) return;
    const mount: HTMLDivElement = host;
    const stage: HTMLElement = parent;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduced.matches || connection?.saveData) return;
    let destroyed = false;
    let active = false;
    let initializing = false;
    let failed = false;
    let controller: GlobeController | null = null;
    const canRun = () => !destroyed && !failed && active && !document.hidden && !reduced.matches;
    const suspend = () => { controller?.pause(); };

    async function activate() {
      if (!canRun()) { suspend(); return; }
      if (controller) { controller.resume(); return; }
      if (initializing) return;
      initializing = true;
      const canvas = document.createElement("canvas");
      canvas.className = "globe-webgl-canvas";
      canvas.setAttribute("aria-hidden", "true");
      canvas.setAttribute("role", "presentation");
      try {
        const renderer = await import("./globe-webgl");
        if (!canRun()) return;
        mount.appendChild(canvas);
        const low = window.innerWidth < 800 || (navigator.hardwareConcurrency ?? 4) <= 4;
        const instance = await renderer.createGlobeWebGL(canvas, stage, low ? "low" : "high", () => {
          failed = true;
          stage.dataset.phase = "poster";
          controller?.dispose();
          controller = null;
          canvas.remove();
        });
        if (!canRun()) {
          instance.dispose();
          return;
        }
        controller = instance;
        stage.dataset.phase = "orbiting";
      } catch {
        failed = true;
        controller?.dispose();
        controller = null;
        stage.dataset.phase = "poster";
      } finally {
        initializing = false;
        if (stage.dataset.phase !== "orbiting") canvas.remove();
      }
    }
    const visibility = new IntersectionObserver((entries) => {
      active = entries.some((entry) => entry.isIntersecting);
      if (canRun()) void activate();
      else suspend();
    }, { rootMargin: "150px", threshold: 0 });
    visibility.observe(stage);
    const onDocumentVisibility = () => {
      if (canRun()) void activate();
      else suspend();
    };
    const onMotion = () => {
      if (reduced.matches) {
        suspend();
        controller?.dispose();
        controller = null;
        stage.dataset.phase = "poster";
        mount.querySelector("canvas")?.remove();
      } else if (canRun()) void activate();
    };
    document.addEventListener("visibilitychange", onDocumentVisibility);
    reduced.addEventListener("change", onMotion);
    return () => {
      destroyed = true;
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onDocumentVisibility);
      reduced.removeEventListener("change", onMotion);
      controller?.dispose();
      mount.querySelector("canvas")?.remove();
    };
  }, []);
  return <div ref={hostRef} className="globe-webgl-runtime" aria-hidden="true" />;
}
