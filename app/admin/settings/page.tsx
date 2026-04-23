import Link from "next/link";
import { clearHeroVideoAction } from "@/app/actions/cms";
import { ContactSettingsSection } from "@/components/admin/ContactSettingsSection";
import { HeroVideoForm } from "@/components/admin/HeroVideoForm";
import { AdminNav } from "@/components/admin/AdminNav";
import { prisma } from "@/lib/prisma";

function toPreviewSrc(path: string): string {
  if (!path.startsWith("http")) return path;
  if (path.includes("blob.vercel-storage.com")) {
    return `/api/hero-video?src=${encodeURIComponent(path)}`;
  }
  return path;
}

export default async function AdminSettingsPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const blobReady = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            ← Admin home
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold uppercase tracking-wide text-white sm:text-3xl">
            Site media &amp; contact
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Hero video +{" "}
            <Link
              href="/admin/contact"
              className="text-teal-400/90 underline-offset-2 hover:underline"
            >
              contact &amp; booking
            </Link>
            .
          </p>
        </div>
      </div>
      <AdminNav />

      <ContactSettingsSection s={s} className="mt-10" />

      <section className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-teal-950/30 to-transparent p-6 shadow-xl shadow-black/20 sm:p-8">
        <h2 className="text-lg font-semibold text-white">Hero video</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Uploaded to{" "}
          <span className="text-teal-400/90">Vercel Blob</span> — fast delivery
          worldwide. Replaces any previous clip.
        </p>
        {s?.heroVideoPath ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#3a322a] bg-[#0f0d0b]/70 p-3">
            <div className="h-16 w-28 shrink-0 overflow-hidden rounded-md border border-[#4a3f35] bg-[#1b1713]">
              <video
                src={toPreviewSrc(s.heroVideoPath)}
                className="h-full w-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-[#8f7b61]">
                Current hero
              </p>
              <p className="truncate text-sm text-[#d9cbb8]">Saved and active</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">
            No video — visitors see the gradient hero only.
          </p>
        )}

        <div className="mt-6">
          <HeroVideoForm blobReady={blobReady} />
        </div>

        {s?.heroVideoPath ? (
          <form action={clearHeroVideoAction} className="mt-6 border-t border-white/10 pt-6">
            <button
              type="submit"
              className="text-sm text-red-400/90 underline-offset-4 transition hover:text-red-300 hover:underline"
            >
              Remove video from site
            </button>
          </form>
        ) : null}
      </section>
    </div>
  );
}
