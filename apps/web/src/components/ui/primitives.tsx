import Link from "next/link";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { IconName } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

type ButtonStyle = {
  variant?: "primary" | "secondary" | "ghost";
  size?: "small" | "normal";
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};
export function ButtonLink({
  href,
  variant = "primary",
  size = "normal",
  arrow = true,
  className,
  children,
  ...props
}: ButtonStyle &
  Omit<React.ComponentProps<typeof Link>, "className" | "children" | "size">) {
  return (
    <Link
      href={href}
      className={cn(
        "button",
        `button--${variant}`,
        size === "small" && "button--small",
        className,
      )}
      {...props}
    >
      {children}
      {arrow && <ArrowRight size={16} aria-hidden="true" />}
    </Link>
  );
}
export function Button({
  variant = "primary",
  size = "normal",
  arrow = true,
  className,
  children,
  ...props
}: ButtonStyle & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "button",
        `button--${variant}`,
        size === "small" && "button--small",
        className,
      )}
      {...props}
    >
      {children}
      {arrow && <ArrowRight size={16} aria-hidden="true" />}
    </button>
  );
}
export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container", className)} {...props} />;
}
export function Section({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("section", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("eyebrow", className)}>{children}</p>;
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  children,
  centered = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  centered?: boolean;
}) {
  return (
    <div
      className={cn("section-heading", centered && "section-heading--center")}
    >
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("badge", className)}>{children}</span>;
}
export function IconTile({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <span className={cn("icon-tile", className)}>
      <Icon name={name} />
    </span>
  );
}
export function FeaturePanel({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="feature-panel">
      <IconTile name={icon} />
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </article>
  );
}
export function Grid({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card-grid", className)} {...props} />;
}
export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div aria-hidden="true" className={cn("skeleton", className)} {...props} />
  );
}
export function EmptyState({
  icon = "sparkles",
  title,
  children,
}: {
  icon?: IconName;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="empty-state">
      <IconTile name={icon} />
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export function Divider() {
  return <hr className="section-divider" />;
}
export function Glow({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("decorative-glow", className)} />
  );
}
export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>
          <Link href="/">Home</Link>
        </li>
        {items.map((item) => (
          <li key={item.label}>
            <ChevronRight size={12} aria-hidden="true" />
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function Field({
  label,
  id,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("field", className)}>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
