import Link from "next/link";
import { GalleryMasonryClient } from "@/components/gallery/GalleryMasonryClient";
import { getGalleryAll } from "@/lib/gallery-data";

export const revalidate = 0;

export default async function GalleryPage() {
  const images = await getGalleryAll();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6">
        <Link href="/" className="text-sm text-zinc-400 transition hover:text-zinc-200">
          ← Back to home
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
          Gallery
        </h1>
      </div>

      {images.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center text-sm text-zinc-400">
          No gallery images yet.
        </div>
      ) : (
        <GalleryMasonryClient images={images} />
      )}
    </main>
  );
}
