import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { sceneAssets } from "./scene-contracts";

/** Supply a canvas as children in Part 03; semantic hero copy stays outside the scene. */
export function ParticleMountainStage({ children }: { children?: ReactNode }) {
  return (
    <div
      className="mountain-stage"
      data-scene="particle-mountain"
      data-phase="poster"
      aria-hidden="true"
    >
      <Image
        src={sceneAssets.mountainPoster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="mountain-poster"
      />
      <div className="mountain-stage-shade" />
      {children}
    </div>
  );
}
export function Landscape({
  name = "summit-path",
  className,
  priority = false,
}: {
  name?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("landscape", className)} aria-hidden="true">
      <Image
        src={`/assets/landscapes/${name}.webp`}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
      />
      <div className="landscape-shade" />
    </div>
  );
}
/** Static, geometrically projected globe. Part 04 owns rotation, camera, and pointer interaction. */
export function OrbitGlobeStage({
  children,
  compact = false,
}: {
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn("globe-stage", compact && "globe-stage--compact")}
      data-scene="orbit-globe"
    >
      <div className="globe-aura" />
      <Image
        src={sceneAssets.earthPoster}
        alt="An orange network globe connecting marketing channels"
        width={640}
        height={640}
        className="globe-image"
      />
      <svg viewBox="0 0 640 640" aria-hidden="true" className="orbit-paths">
        <ellipse
          cx="320"
          cy="320"
          rx="305"
          ry="83"
          transform="rotate(-22 320 320)"
        />
        <ellipse
          cx="320"
          cy="320"
          rx="294"
          ry="110"
          transform="rotate(24 320 320)"
        />
        <ellipse
          cx="320"
          cy="320"
          rx="285"
          ry="126"
          transform="rotate(-48 320 320)"
        />
      </svg>
      {!compact && (
        <div
          className="orbit-platforms"
          aria-label="Illustrative marketing channels, not partner endorsements"
        >
          {[
            "google",
            "meta",
            "youtube",
            "linkedin",
            "instagram",
            "analytics",
          ].map((name) => (
            <div
              className={`orbit-platform orbit-platform--${name}`}
              key={name}
            >
              <Image
                src={`/assets/platforms/${name}.svg`}
                width={31}
                height={31}
                alt={
                  name === "analytics"
                    ? "Google Analytics"
                    : name.charAt(0).toUpperCase() + name.slice(1)
                }
              />
            </div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
