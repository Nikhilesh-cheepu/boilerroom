"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";

const links = [
  { href: "#events", label: "Events" },
  { href: "#djs", label: "DJs" },
  { href: "#menu", label: "Menu" },
  { href: "#faq", label: "FAQ" },
];

const LOGO_SRC = "/boilerroom-logo.png";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background,backdrop-filter,border-color] duration-300",
        scrolled
          ? "border-br-border bg-br-bg/75 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-4">
        <Link
          href="#top"
          className="flex min-w-0 shrink items-center gap-2 touch-manipulation sm:gap-3"
        >
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md sm:h-11 sm:w-11">
            <Image
              src={LOGO_SRC}
              alt="Boiler Room"
              fill
              sizes="(max-width: 640px) 36px, 44px"
              className="object-contain"
              priority
            />
          </span>
          <span className="font-display truncate text-base font-semibold uppercase tracking-[0.15em] text-br-text sm:text-lg sm:tracking-[0.2em]">
            Boiler Room
          </span>
        </Link>
        <nav
          className="flex max-w-[58vw] shrink-0 flex-wrap justify-end gap-x-2 gap-y-1 text-[11px] font-medium text-br-muted sm:max-w-none sm:gap-x-4 sm:text-xs md:gap-x-6 md:text-sm"
          aria-label="Sections"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="touch-manipulation whitespace-nowrap py-1 transition-colors hover:text-br-text"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
