"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/layout/Container";

const links = [
  { href: "#events", label: "Events" },
  { href: "#menu", label: "Menu" },
];

const LOGO_SRC = "/boilerroom-logo.png";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-40">
      <Container className="relative">
        <div className="relative mx-auto h-[3.4rem] w-full max-w-[35rem] rounded-2xl border border-white/15 bg-[linear-gradient(120deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06)_35%,rgba(255,255,255,0.02))] shadow-[0_10px_35px_-22px_rgba(0,0,0,0.85)] backdrop-blur-[14px]">
          <div className="flex h-full items-center justify-between px-3">
        <Link
          href="#top"
          className="z-10 inline-flex items-center touch-manipulation"
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#0f1a2d]/46 shadow-[0_8px_18px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <span className="relative h-6 w-6 overflow-hidden rounded-md">
              <Image
                src={LOGO_SRC}
                alt="Boiler Room"
                fill
                sizes="24px"
                className="object-contain"
                priority
              />
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/22 bg-[#101828]/44 text-[#ecf2ff] backdrop-blur-md transition hover:bg-[#18243a]/70"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-main-menu"
        >
          {menuOpen ? (
            <X className="h-4 w-4" strokeWidth={2.2} />
          ) : (
            <Menu className="h-4 w-4" strokeWidth={2.2} />
          )}
        </button>
          </div>
        </div>

        {menuOpen ? (
          <div
            id="mobile-main-menu"
            className="absolute right-0 top-[calc(100%+0.55rem)] z-20 w-[11rem] rounded-2xl border border-[#cad6ff33] bg-[#0a101c]/90 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
          >
            <nav className="flex flex-col gap-1" aria-label="Sections">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-2 text-xs font-medium tracking-wide text-[#c8d4f5] transition hover:bg-[#bacbff14] hover:text-[#f4f7ff]"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/book"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-[#eef3ff] px-3 py-2 text-xs font-semibold tracking-wide text-[#0b0f16]"
              >
                Book Table
              </Link>
            </nav>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
