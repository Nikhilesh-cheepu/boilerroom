import Link from "next/link";
import {
  clearHeroVideoAction,
  updateSiteCopyAction,
  uploadHeroVideoAction,
} from "@/app/actions/cms";
import { AdminNav } from "@/components/admin/AdminNav";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="text-sm text-zinc-500 hover:text-zinc-300"
          >
            ← Admin home
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold uppercase text-white">
            Hero &amp; copy
          </h1>
        </div>
      </div>
      <AdminNav />

      <section className="mt-10 space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Homepage text</h2>
        <form
          action={updateSiteCopyAction}
          className="flex flex-col gap-4"
        >
          <label className="text-sm text-zinc-300">
            Tagline (headline)
            <input
              name="tagline"
              required
              defaultValue={s?.tagline ?? ""}
              className="mt-1 w-full min-h-12 rounded-xl border border-white/15 bg-black/30 px-4 text-base text-white outline-none focus:ring-2 focus:ring-br-accent"
            />
          </label>
          <label className="text-sm text-zinc-300">
            Hero subcopy
            <textarea
              name="heroSub"
              required
              rows={3}
              defaultValue={s?.heroSub ?? ""}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base text-white outline-none focus:ring-2 focus:ring-br-accent"
            />
          </label>
          <button
            type="submit"
            className="min-h-12 rounded-xl bg-br-accent font-semibold text-white hover:opacity-95"
          >
            Save copy
          </button>
        </form>
      </section>

      <section className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Hero video</h2>
        <p className="text-sm text-zinc-400">
          MP4, WebM, or MOV — max 100MB. Plays muted, looping, inline on mobile.
        </p>
        {s?.heroVideoPath ? (
          <p className="break-all text-xs text-zinc-500">
            Current: {s.heroVideoPath}
          </p>
        ) : (
          <p className="text-sm text-zinc-500">No video — gradient fallback.</p>
        )}
        <form
          action={uploadHeroVideoAction}
          encType="multipart/form-data"
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <label className="flex-1 text-sm text-zinc-300">
            File
            <input
              name="video"
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
              className="mt-1 w-full text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-white"
            />
          </label>
          <button
            type="submit"
            className="min-h-12 shrink-0 rounded-xl border border-white/15 bg-white/10 px-6 font-semibold text-white hover:bg-white/15"
          >
            Upload
          </button>
        </form>
        {s?.heroVideoPath ? (
          <form action={clearHeroVideoAction}>
            <button
              type="submit"
              className="text-sm text-red-400 underline-offset-4 hover:underline"
            >
              Remove video
            </button>
          </form>
        ) : null}
      </section>
    </div>
  );
}
