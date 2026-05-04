import { GalleryGridManager } from "@/components/admin/GalleryGridManager";
import { GalleryUploadForm } from "@/components/admin/GalleryUploadForm";
import { getGalleryAll } from "@/lib/gallery-data";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await getGalleryAll();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 border-b border-white/[0.08] pb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Gallery
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Upload and curate images for the home preview and full gallery page.
        </p>
      </header>

      <GalleryUploadForm />
      <GalleryGridManager images={images} />
    </div>
  );
}
