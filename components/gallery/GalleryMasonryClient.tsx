"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { GalleryImageDTO } from "@/lib/gallery-data";

type Props = { images: GalleryImageDTO[] };

function bentoCellClass(i: number): string {
  const p = i % 8;
  if (p === 0) return "col-span-2 row-span-2";
  if (p === 3 || p === 6) return "row-span-2";
  if (p === 5) return "col-span-2";
  return "col-span-1 row-span-1";
}

export function GalleryMasonryClient({ images }: Props) {
  const reduced = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => {
    setActiveIndex((v) => (v === null ? null : (v - 1 + images.length) % images.length));
  }, [images.length]);
  const next = useCallback(() => {
    setActiveIndex((v) => (v === null ? null : (v + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, prev, next]);

  return (
    <>
      <div className="grid auto-rows-[7rem] grid-cols-2 gap-2 sm:auto-rows-[9rem] sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <motion.button
            key={img.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            whileHover={reduced ? undefined : { scale: 1.015 }}
            whileTap={reduced ? undefined : { scale: 0.985 }}
            className={`${bentoCellClass(i)} group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1321] shadow-lg shadow-black/30`}
          >
            <Image
              src={img.url}
              alt={img.alt ?? "Gallery image"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-300 group-hover:scale-[1.06]"
              loading="lazy"
              unoptimized
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null ? (
          <motion.div
            className="fixed inset-0 z-[120] bg-black/75 p-4 backdrop-blur-sm sm:p-6"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            onClick={close}
          >
            <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-center">
              <motion.div
                className="relative h-[72vh] w-full overflow-hidden rounded-2xl border border-white/20 bg-[#0d1220]"
                initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.22 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[activeIndex].url}
                  alt={images[activeIndex].alt ?? "Gallery modal image"}
                  fill
                  sizes="90vw"
                  className="object-contain"
                  priority
                  unoptimized
                />

                <button
                  type="button"
                  onClick={close}
                  className="absolute right-3 top-3 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-sm text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/35 px-3 py-2 text-sm text-white"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/35 px-3 py-2 text-sm text-white"
                >
                  Next
                </button>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
