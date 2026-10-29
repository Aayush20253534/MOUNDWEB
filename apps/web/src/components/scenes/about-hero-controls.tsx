"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function AboutHeroControls() {
  const button = useRef<HTMLButtonElement>(null);
  const [available, setAvailable] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAvailable(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  function toggleMotion() {
    const nextPaused = !paused;
    const hero = button.current?.closest<HTMLElement>(".about-hero");
    if (hero) {
      hero.dataset.heroPaused = String(nextPaused);
      hero.style.removeProperty("--about-parallax-x");
      hero.style.removeProperty("--about-parallax-y");
    }
    setPaused(nextPaused);
  }

  const Icon = paused ? Play : Pause;
  return (
    <button
      ref={button}
      type="button"
      className="about-motion-toggle"
      hidden={!available}
      onClick={toggleMotion}
      aria-label={paused ? "Play hero animation" : "Pause hero animation"}
    >
      <Icon size={15} aria-hidden="true" />
      {paused ? "Play animation" : "Pause animation"}
    </button>
  );
}
