import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-white">
            Admin
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage homepage content, hero video, contact details, menus, and FAQs.
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="min-h-11 rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-zinc-200 hover:bg-white/10"
          >
            Log out
          </button>
        </form>
      </div>

      <div className="mt-8">
        <AdminNav />
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        <li>
          <Link
            href="/admin/settings"
            className="block rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-5 transition hover:border-teal-500/40"
          >
            <p className="font-semibold text-white">Hero video</p>
            <p className="mt-1 text-sm text-zinc-400">
              Vercel Blob upload for the homepage hero.
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/contact"
            className="block rounded-2xl border border-white/10 bg-gradient-to-br from-teal-950/25 to-transparent p-5 transition hover:border-teal-500/40"
          >
            <p className="font-semibold text-white">Contact &amp; booking</p>
            <p className="mt-1 text-sm text-zinc-400">
              Phone, WhatsApp, Instagram, maps, sticky bar message.
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/gallery"
            className="block rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-950/25 to-transparent p-5 transition hover:border-indigo-400/45"
          >
            <p className="font-semibold text-white">Gallery</p>
            <p className="mt-1 text-sm text-zinc-400">
              Upload and manage floating preview + full gallery.
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/events"
            className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-br-accent/50"
          >
            <p className="font-semibold text-white">Events</p>
            <p className="mt-1 text-sm text-zinc-400">
              Featured row on the homepage.
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/djs"
            className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-br-accent/50"
          >
            <p className="font-semibold text-white">DJs</p>
            <p className="mt-1 text-sm text-zinc-400">Residents &amp; guests.</p>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/menu"
            className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-br-accent/50"
          >
            <p className="font-semibold text-white">Menu</p>
            <p className="mt-1 text-sm text-zinc-400">
              Food &amp; drink categories and items.
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/faq"
            className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-br-accent/50"
          >
            <p className="font-semibold text-white">FAQ</p>
            <p className="mt-1 text-sm text-zinc-400">Practicals section.</p>
          </Link>
        </li>
        <li>
          <Link
            href="/admin/weekly"
            className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-br-accent/50"
          >
            <p className="font-semibold text-white">Weekly rhythm</p>
            <p className="mt-1 text-sm text-zinc-400">Thu–Sun strip.</p>
          </Link>
        </li>
      </ul>

      <p className="mt-10 text-center text-xs text-zinc-600">
        <Link href="/" className="underline-offset-4 hover:underline">
          View public site
        </Link>
      </p>
    </div>
  );
}
