import { getGalleryPreview } from "@/lib/gallery-data";
import { GalleryFloatingPreviewClient } from "./GalleryFloatingPreviewClient";

export async function GallerySection() {
  const images = await getGalleryPreview(14);

  return (
    <section className="px-4 py-12 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 sm:mb-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#b7c6ee]">Moments</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-[#eef3ff] sm:text-3xl">
            Gallery
          </h2>
        </div>

        {images.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#b7c6ee44] bg-[#0b101a]/50 p-8 text-center text-sm text-[#9faccd]">
            Gallery images will appear here once uploaded from admin.
          </div>
        ) : (
          <GalleryFloatingPreviewClient images={images} />
        )}
      </div>
    </section>
  );
}
