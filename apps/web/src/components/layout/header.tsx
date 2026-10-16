"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { navigation, exploreLinks, partnerLinks } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";
import { ButtonLink } from "../ui/primitives";

type DropLink = { label: string; href: string; detail: string };
function NavDropdown({
  label,
  links,
  pathname,
}: {
  label: string;
  links: readonly DropLink[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div
      className="nav-dropdown"
      ref={ref}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        className={cn(
          "nav-link",
          links.some((link) => pathname === link.href || pathname.startsWith(link.href + "/")) && "is-active",
        )}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown size={12} aria-hidden="true" />
      </button>
      {open && (
        <div id={panelId} className="dropdown-panel">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              <span>
                {link.label}
                <ArrowUpRight size={14} aria-hidden="true" />
              </span>
              <small>{link.detail}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav aria-label="Main navigation" className="desktop-nav">
          {navigation.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn("nav-link", isActive(link.href) && "is-active")}
            >
              {link.label}
            </Link>
          ))}
          <NavDropdown
            label="Explore"
            links={exploreLinks}
            pathname={pathname}
          />
          <NavDropdown
            label="Partner With Us"
            links={partnerLinks}
            pathname={pathname}
          />
          <Link
            href="/contact"
            className={cn("nav-link", isActive("/contact") && "is-active")}
            aria-current={isActive("/contact") ? "page" : undefined}
          >
            Contact
          </Link>
        </nav>
        <ButtonLink
          href="/contact?type=growth#inquiry"
          variant="secondary"
          size="small"
          className="header-cta"
        >
          Start a project
        </ButtonLink>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              className="icon-button mobile-toggle"
              aria-label="Open navigation"
            >
              <Menu size={23} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content className="mobile-nav-panel">
              <Dialog.Title className="sr-only">
                MOUNDWEB navigation
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Explore services, programs, and partnership opportunities.
              </Dialog.Description>
              <div className="mobile-nav-top">
                <Brand />
                <Dialog.Close
                  className="icon-button"
                  aria-label="Close navigation"
                >
                  <X />
                </Dialog.Close>
              </div>
              <nav aria-label="Mobile navigation">
                {navigation.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                    <ArrowUpRight size={18} />
                  </Link>
                ))}
                <p className="eyebrow">Explore MOUNDWEB</p>
                {exploreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <p className="eyebrow">Partner with us</p>
                {partnerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/contact" onClick={() => setOpen(false)}>
                  Contact
                  <ArrowUpRight size={18} />
                </Link>
              </nav>
              <ButtonLink
                href="/contact#inquiry"
                onClick={() => setOpen(false)}
              >
                Start a conversation
              </ButtonLink>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
