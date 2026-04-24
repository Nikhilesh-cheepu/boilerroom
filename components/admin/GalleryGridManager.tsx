"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  deleteGalleryImage,
  deleteGalleryImages,
  moveGalleryImage,
} from "@/app/actions/cms";
import type { GalleryImageDTO } from "@/lib/gallery-data";

type Props = { images: GalleryImageDTO[] };

export function GalleryGridManager({ images }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<string[]>([]);

  const hasSelection = useMemo(() => selected.length > 0, [selected.length]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const clear = () => setSelected([]);

  const onDeleteSelected = () => {
    if (!hasSelection || isPending) return;
    startTransition(async () => {
      const fd = new FormData();
      selected.forEach((id) => fd.append("ids", id));
      await deleteGalleryImages(fd);
      clear();
      router.refresh();
    });
  };

  return (
    <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={clear}
          disabled={!hasSelection || isPending}
          className="rounded-xl border border-white/20 bg-white/[0.04] px-3 py-2 text-xs text-zinc-200 disabled:opacity-45"
        >
          Clear selection
        </button>
        <button
          type="button"
          onClick={onDeleteSelected}
          disabled={!hasSelection || isPending}
          className="rounded-xl border border-red-400/35 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200 disabled:opacity-45"
        >
          Delete selected ({selected.length})
        </button>
      </div>

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-sm text-zinc-400">
          No images uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => {
            const isSelected = selected.includes(img.id);
            return (
              <article
                key={img.id}
                className={`group rounded-xl border p-2 ${isSelected ? "border-[#dbe5ff88] bg-[#dbe5ff12]" : "border-white/10 bg-white/[0.02]"}`}
              >
                <button
                  type="button"
                  onClick={() => toggle(img.id)}
                  className="relative block aspect-square w-full overflow-hidden rounded-lg"
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? "Gallery image"}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                    loading="lazy"
                    unoptimized
                  />
                  <span className="absolute left-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-md border border-white/35 bg-black/45 text-[10px] text-white">
                    {isSelected ? "✓" : ""}
                  </span>
                </button>
                <div className="mt-2 flex items-center justify-between gap-1">
                  <div className="text-[11px] text-zinc-400">#{img.sortOrder}</div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        startTransition(async () => {
                          const fd = new FormData();
                          fd.set("id", img.id);
                          fd.set("direction", "up");
                          await moveGalleryImage(fd);
                          router.refresh();
                        })
                      }
                      className="rounded-md border border-white/20 px-1.5 py-1 text-[11px] text-zinc-200"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        startTransition(async () => {
                          const fd = new FormData();
                          fd.set("id", img.id);
                          fd.set("direction", "down");
                          await moveGalleryImage(fd);
                          router.refresh();
                        })
                      }
                      className="rounded-md border border-white/20 px-1.5 py-1 text-[11px] text-zinc-200"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        startTransition(async () => {
                          const fd = new FormData();
                          fd.set("id", img.id);
                          await deleteGalleryImage(fd);
                          setSelected((prev) => prev.filter((x) => x !== img.id));
                          router.refresh();
                        })
                      }
                      className="rounded-md border border-red-400/35 bg-red-500/10 px-2 py-1 text-[11px] text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
