import Link from "next/link";

const links = [
  { href: "/admin", label: "Home" },
  { href: "/admin/settings", label: "Hero & copy" },
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
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
