"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string; exact?: boolean };

const links: NavLink[] = [
  { href: "/admin", label: "Home", exact: true },
  { href: "/admin/settings", label: "Site & hero" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/djs", label: "DJs" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/weekly", label: "Weekly" },
];

function linkActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-4">
      {links.map((l) => {
        const active = linkActive(pathname, l.href, l.exact);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-xl px-3.5 py-2 text-sm font-medium transition",
              active
                ? "border border-sky-500/40 bg-sky-500/15 text-white shadow-[0_0_20px_-8px_rgba(56,189,248,0.5)]"
                : "border border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-zinc-100",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
