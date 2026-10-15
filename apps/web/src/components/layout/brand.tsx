import Link from "next/link";
import { cn } from "@/lib/utils";

export function MountainMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 58 36"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M1 34 16 14l9 12-6 8H1Z" fill="currentColor" />
      <path d="m19 12 8-11 27 33H38L19 12Z" fill="currentColor" />
      <path d="m33 9 6-8 18 23-6 8L33 9Z" fill="currentColor" />
      <path d="m21 34 7-9 7 9H21Z" fill="currentColor" />
    </svg>
  );
}
export function Brand({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="MOUNDWEB home"
      className={cn("brand", compact && "brand--compact", className)}
    >
      <MountainMark />
      <span>
        MOUND<span className="brand-accent">WEB</span>
      </span>
    </Link>
  );
}
