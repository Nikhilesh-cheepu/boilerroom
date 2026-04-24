import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { GalleryGridManager } from "@/components/admin/GalleryGridManager";
import { GalleryUploadForm } from "@/components/admin/GalleryUploadForm";
import { getGalleryAll } from "@/lib/gallery-data";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await getGalleryAll();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-zinc-500 transition hover:text-zinc-300">
          ← Admin home
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold uppercase tracking-wide text-white sm:text-3xl">
          Gallery
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Upload, sort, and curate images shown on homepage and full gallery.
        </p>
      </div>

      <AdminNav />

      <div className="mt-6">
        <GalleryUploadForm />
        <GalleryGridManager images={images} />
      </div>
    </div>
  );
}
