import Link from "next/link";

const links = [
  { href: "/admin", label: "Home" },
  { href: "/admin/settings", label: "Hero video" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/djs", label: "DJs" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/weekly", label: "Weekly" },
];

export function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-white/10 pb-4 text-sm">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 font-medium text-zinc-200 transition hover:border-teal-500/35 hover:bg-teal-950/30 hover:text-white"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
