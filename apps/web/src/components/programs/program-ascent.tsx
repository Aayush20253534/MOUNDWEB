"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, SkipForward } from "lucide-react";

const milestones = ["Discover", "Learn", "Build", "Grow"];

/** A single, finite climb. The complete path is readable before JS loads. */
export function ProgramAscent() {
  const scene = useRef<HTMLDivElement>(null);
  const controls = useRef<{ play: () => void; finish: () => void } | null>(
    null,
  );
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    const steps = [
      ...element.querySelectorAll<HTMLElement>(".learning-path-step"),
    ];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const supported = typeof element.animate === "function";
    let animations: Animation[] = [];
    let generation = 0;
    let disposed = false;
    let observer: IntersectionObserver | undefined;

    function cancel() {
      generation += 1;
      animations.forEach((animation) => animation.cancel());
      animations = [];
    }

    function finish() {
      cancel();
      setPlaying(false);
    }

    function play() {
      observer?.disconnect();
      cancel();
      if (reduced.matches || !supported) return;
      setPlaying(true);
      const current = generation;
      animations = steps.map((step, index) =>
        step.animate(
          [
            { opacity: 0, transform: "translate3d(0, 24px, 0) scale(0.88)" },
            { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
          ],
          {
            duration: 700,
            delay: 150 + index * 1000,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "backwards",
          },
        ),
      );
      if (document.hidden) animations.forEach((animation) => animation.pause());
      Promise.all(animations.map((animation) => animation.finished))
        .then(() => {
          if (!disposed && generation === current) {
            animations = [];
            setPlaying(false);
          }
        })
        .catch(() => {
          // Skipping, replaying or leaving the page cancels the old sequence.
        });
    }

    function syncVisibility() {
      animations.forEach((animation) => {
        if (
          animation.playState === "finished" ||
          animation.playState === "idle"
        )
          return;
        if (document.hidden) animation.pause();
        else animation.play();
      });
    }

    function syncPreference() {
      observer?.disconnect();
      setAvailable(supported && !reduced.matches);
      if (reduced.matches) finish();
      else play();
    }

    controls.current = { play, finish };
    setAvailable(supported && !reduced.matches);
    if (supported && !reduced.matches) {
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting) return;
            play();
            observer?.disconnect();
          },
          { threshold: 0.15 },
        );
        observer.observe(element);
      } else play();
    }
    reduced.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      disposed = true;
      cancel();
      observer?.disconnect();
      reduced.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
      controls.current = null;
    };
  }, []);

  const ControlIcon = playing ? SkipForward : RotateCcw;
  return (
    <div className="program-ascent" ref={scene}>
      <ol
        className="learning-path-labels"
        aria-label="Learning journey from base to summit"
      >
        {milestones.map((label, index) => (
          <li className="learning-path-step" key={label}>
            <b aria-hidden="true">0{index + 1}</b>
            {label}
          </li>
        ))}
      </ol>
      <button
        className="program-ascent-control"
        type="button"
        hidden={!available}
        onClick={() =>
          playing ? controls.current?.finish() : controls.current?.play()
        }
        aria-label={
          playing
            ? "Skip mountain ascent animation"
            : "Replay mountain ascent animation"
        }
      >
        <ControlIcon size={14} aria-hidden="true" />
        {playing ? "Skip animation" : "Replay ascent"}
      </button>
    </div>
  );
}
