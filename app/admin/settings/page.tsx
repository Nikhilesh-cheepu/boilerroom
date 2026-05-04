import Link from "next/link";
import { clearHeroVideoAction } from "@/app/actions/cms";
import { AdminNav } from "@/components/admin/AdminNav";
import { ContactSettingsSection } from "@/components/admin/ContactSettingsSection";
import { HeroVideoUploader } from "@/components/admin/hero-video/HeroVideoUploader";
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-5 sm:py-10">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-sm text-zinc-500 transition hover:text-zinc-300"
        >
          ← Admin home
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Site &amp; hero
        </h1>
        <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-zinc-400">
          Homepage hero video (Vercel Blob) and contact fields. For booking-only
          fields, use{" "}
          <Link
            href="/admin/contact"
            className="text-sky-400/95 underline-offset-2 hover:underline"
          >
            Contact
          </Link>
          .
        </p>
      </div>

      <AdminNav />

      <ContactSettingsSection s={s} className="mt-10" />

      <section className="mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-1 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Hero video</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Replaces the current clip everywhere. Large files use multipart upload.
            </p>
          </div>
        </div>

        {s?.heroVideoPath ? (
          <div className="mt-5 flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/50">
              <video
                src={toPreviewSrc(s.heroVideoPath)}
                className="h-full w-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                Live on site
              </p>
              <p className="truncate text-sm text-zinc-200">Hero video is active</p>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-zinc-500">
            No video yet — visitors see the gradient hero until you upload one.
          </p>
        )}

        <div className="mt-6">
          <HeroVideoUploader blobReady={blobReady} />
        </div>

        {s?.heroVideoPath ? (
          <form
            action={clearHeroVideoAction}
            className="mt-8 border-t border-white/[0.06] pt-6"
          >
            <button
              type="submit"
              className="text-sm font-medium text-red-400/90 transition hover:text-red-300"
            >
              Remove hero video
            </button>
          </form>
        ) : null}
      </section>
    </div>
  );
}
