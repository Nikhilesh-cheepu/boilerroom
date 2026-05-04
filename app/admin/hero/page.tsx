import { clearHeroVideoAction } from "@/app/actions/cms";
import { HeroVideoUploader } from "@/components/admin/hero-video/HeroVideoUploader";
import { prisma } from "@/lib/prisma";

function toPreviewSrc(path: string): string {
  if (!path.startsWith("http")) return path;
  if (path.includes("blob.vercel-storage.com")) {
    return `/api/hero-video?src=${encodeURIComponent(path)}`;
  }
  return path;
}

export default async function AdminHeroPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const blobReady = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 border-b border-white/[0.08] pb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Hero video
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Full-screen homepage clip via Vercel Blob. Upload replaces the previous file.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-xl sm:p-8">
        {s?.heroVideoPath ? (
          <div className="mb-6 flex items-center gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
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
                Live
              </p>
              <p className="truncate text-sm text-zinc-200">Hero video is active</p>
            </div>
          </div>
        ) : (
          <p className="mb-6 text-sm text-zinc-500">
            No video — visitors see the gradient hero until you upload one.
          </p>
        )}

        <HeroVideoUploader blobReady={blobReady} />

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
