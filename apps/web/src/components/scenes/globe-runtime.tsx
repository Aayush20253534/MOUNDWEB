"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { GlobeController } from "./globe-webgl";

/** Activates the real sphere only while visible. The server-rendered globe is always the fallback. */
export function GlobeRuntime({ controls = false }: { controls?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const syncRef = useRef<(() => void) | null>(null);
  const [paused, setPaused] = useState(false);
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const host = hostRef.current;
    const parent = host?.closest<HTMLElement>(".globe-stage");
    if (!host || !parent) return;
    const mount: HTMLDivElement = host;
    const stage: HTMLElement = parent;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;
    let destroyed = false;
    let active = false;
    let initializing = false;
    let failed = false;
    let controller: GlobeController | null = null;
    const canRun = () =>
      !destroyed &&
      !failed &&
      active &&
      !document.hidden &&
      !reduced.matches &&
      !pausedRef.current;
    const suspend = () => {
      controller?.pause();
      if (controller) stage.dataset.playback = "paused";
    };

    async function activate() {
      if (!canRun()) {
        suspend();
        return;
      }
      if (controller) {
        controller.resume();
        stage.dataset.playback = "running";
        return;
      }
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
        const low =
          window.innerWidth < 800 || (navigator.hardwareConcurrency ?? 4) <= 4;
        const instance = await renderer.createGlobeWebGL(
          canvas,
          stage,
          low ? "low" : "high",
          () => {
            failed = true;
            stage.dataset.phase = "poster";
            delete stage.dataset.playback;
            if (!destroyed) setAvailable(false);
            controller?.dispose();
            controller = null;
            canvas.remove();
          },
        );
        if (!canRun()) {
          instance.dispose();
          return;
        }
        controller = instance;
        stage.dataset.phase = "orbiting";
        stage.dataset.playback = "running";
        setAvailable(true);
      } catch {
        failed = true;
        controller?.dispose();
        controller = null;
        stage.dataset.phase = "poster";
        delete stage.dataset.playback;
        if (!destroyed) setAvailable(false);
      } finally {
        initializing = false;
        if (stage.dataset.phase !== "orbiting") canvas.remove();
      }
    }
    const visibility = new IntersectionObserver(
      (entries) => {
        active = entries.some((entry) => entry.isIntersecting);
        if (canRun()) void activate();
        else suspend();
      },
      { rootMargin: "150px", threshold: 0 },
    );
    visibility.observe(stage);
    const onDocumentVisibility = () => {
      if (canRun()) void activate();
      else suspend();
    };
    syncRef.current = onDocumentVisibility;
    const onMotion = () => {
      if (reduced.matches) {
        pausedRef.current = false;
        setPaused(false);
        suspend();
        controller?.dispose();
        controller = null;
        stage.dataset.phase = "poster";
        delete stage.dataset.playback;
        setAvailable(false);
        mount.querySelector("canvas")?.remove();
      } else if (canRun()) void activate();
    };
    document.addEventListener("visibilitychange", onDocumentVisibility);
    reduced.addEventListener("change", onMotion);
    return () => {
      destroyed = true;
      syncRef.current = null;
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onDocumentVisibility);
      reduced.removeEventListener("change", onMotion);
      controller?.dispose();
      mount.querySelector("canvas")?.remove();
      stage.dataset.phase = "poster";
      delete stage.dataset.playback;
    };
  }, []);
  const ControlIcon = paused ? Play : Pause;
  return (
    <>
      <div ref={hostRef} className="globe-webgl-runtime" aria-hidden="true" />
      {controls && (
        <button
          type="button"
          className="globe-motion-control"
          hidden={!available}
          aria-label={paused ? "Resume globe rotation" : "Pause globe rotation"}
          onClick={() => {
            pausedRef.current = !pausedRef.current;
            setPaused(pausedRef.current);
            syncRef.current?.();
          }}
        >
          <ControlIcon size={13} aria-hidden="true" />
          {paused ? "Resume globe" : "Pause globe"}
        </button>
      )}
    </>
  );
}
