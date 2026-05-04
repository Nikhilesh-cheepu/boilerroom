"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const NAV: { href: string; label: string }[] = [
  { href: "/admin/hero", label: "Hero video" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/contact", label: "Contact" },
];

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 flex h-dvh w-[min(100%,15.5rem)] shrink-0 flex-col border-r border-white/[0.08] bg-black/25 px-3 py-5 backdrop-blur-md sm:w-60 sm:px-4">
        <Link
          href="/admin"
          className="px-2 text-sm font-semibold tracking-tight text-white hover:text-sky-200"
        >
          Admin
        </Link>
        <p className="mt-1 px-2 text-[11px] leading-snug text-zinc-500">
          Boiler Room
        </p>

        <nav className="mt-8 flex flex-col gap-1" aria-label="Admin sections">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-sky-500/15 text-white ring-1 ring-sky-500/35"
                    : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 border-t border-white/[0.06] pt-4">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-xs text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-300"
          >
            View site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left text-sm font-medium text-zinc-200 transition hover:bg-white/[0.08]"
            >
              Log out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
