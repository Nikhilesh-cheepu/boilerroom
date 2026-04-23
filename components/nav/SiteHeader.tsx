"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";

const links = [
  { href: "#events", label: "Events" },
  { href: "#menu", label: "Menu" },
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
          ? "border-[#cad6ff29] bg-[#080b12]/84 backdrop-blur-xl"
          : "border-transparent bg-[#080b12]/34 backdrop-blur-sm",
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
          <span className="font-display truncate text-base font-semibold uppercase tracking-[0.15em] text-[#f3f5fd] sm:text-lg sm:tracking-[0.2em]">
            Boiler Room
          </span>
        </Link>
        <nav
          className="flex shrink-0 justify-end gap-x-4 text-[11px] font-medium text-[#9ca6c6] sm:gap-x-6 sm:text-xs md:text-sm"
          aria-label="Sections"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="touch-manipulation whitespace-nowrap py-1 transition-colors hover:text-[#e6edff]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
