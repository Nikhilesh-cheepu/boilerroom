import Link from "next/link";
import { Film, Images, Mail, PartyPopper } from "lucide-react";

const cards = [
  {
    href: "/admin/hero",
    title: "Hero video",
    desc: "Homepage full-screen clip (Vercel Blob).",
    icon: Film,
  },
  {
    href: "/admin/events",
    title: "Events",
    desc: "Featured “What’s on” cards.",
    icon: PartyPopper,
  },
  {
    href: "/admin/gallery",
    title: "Gallery",
    desc: "Home preview + full gallery images.",
    icon: Images,
  },
  {
    href: "/admin/contact",
    title: "Contact",
    desc: "Phone, WhatsApp, maps, booking message.",
    icon: Mail,
  },
] as const;

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Use the sidebar or pick a section below.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {cards.map(({ href, title, desc, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition hover:border-sky-500/35 hover:bg-white/[0.06]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-sky-500/10 text-sky-300">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-white">{title}</span>
                <span className="mt-1 block text-sm text-zinc-500">{desc}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
