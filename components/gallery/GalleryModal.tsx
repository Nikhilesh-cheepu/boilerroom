"use client";

import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const SWIPE_THRESHOLD = 50;

type Props = {
  images: string[];
  brandName: string;
  initialIndex: number;
  onClose: () => void;
};

export function GalleryModal({
  images,
  brandName,
  initialIndex,
  onClose,
}: Props) {
  const reduced = useReducedMotion() ?? false;
  const [index, setIndex] = useState(initialIndex);
  const count = images.length;

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(count - 1, i + 1));
  }, [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  const onSwipeEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
  };

  const atStart = index === 0;
  const atEnd = index === count - 1;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[125] flex flex-col bg-black"
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduced ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <header className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/80 to-transparent px-4 py-4">
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close gallery"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-white transition hover:bg-white/10"
            >
              ×
            </button>
            <p className="truncate text-sm font-medium text-white/90 sm:text-base">
              {brandName} — Gallery ({index + 1}/{count})
            </p>
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pt-14 pb-28 sm:px-4">
          {!atStart ? (
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-lg text-white transition hover:bg-white/30 sm:flex md:left-4"
            >
              ‹
            </button>
          ) : null}

          <motion.div
            key={index}
            className="relative mx-auto h-[calc(100dvh-12rem)] w-full max-w-6xl"
            drag={count > 1 ? "x" : false}
            dragElastic={0.12}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={onSwipeEnd}
            initial={reduced ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.22 }}
          >
            <Image
              src={images[index]}
              alt={`${brandName} gallery ${index + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              unoptimized
            />
          </motion.div>

          {!atEnd ? (
            <button
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-lg text-white transition hover:bg-white/30 sm:flex md:right-4"
            >
              ›
            </button>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-8">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg transition ${
                  i === index
                    ? "scale-110 border-2 border-white opacity-100"
                    : "border border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
