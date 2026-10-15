import type { ReactNode } from "react";
import { Container, Eyebrow } from "../ui/primitives";
import { Landscape } from "../scenes/scene-stages";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  image = "summit-path",
  children,
  artwork,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  image?: string;
  children?: ReactNode;
  artwork?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("page-hero", className)}>
      <Landscape name={image} priority />
      <Container>
        <div className="page-hero-copy">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1>{title}</h1>
          <p>{description}</p>
          {children}
        </div>
        {artwork && <div className="page-hero-artwork">{artwork}</div>}
      </Container>
    </section>
  );
}
