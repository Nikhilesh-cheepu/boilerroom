"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const AUTO_MS = 3800;

type Props = {
  images: string[];
  accentColor: string;
  onOpenFullscreen: (index: number) => void;
};

export function GalleryCoverflow({
  images,
  accentColor,
  onOpenFullscreen,
}: Props) {
  const reduced = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  const goTo = useCallback(
    (i: number) => {
      if (count <= 1) return;
      setIndex(((i % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (reduced || paused || count <= 1) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(t);
  }, [reduced, paused, count]);

  if (count === 0) return null;

  return (
    <div className="mx-auto w-full max-w-md px-4 py-3">
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}20` }}
          aria-hidden
        />

        <div className="overflow-hidden py-1">
          <motion.div
            className="flex"
            animate={{ x: `-${index * 100}%` }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.4, 0, 0.2, 1] }
            }
          >
            {images.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="w-full shrink-0 px-2"
              >
                <button
                  type="button"
                  onClick={() => onOpenFullscreen(i)}
                  className="relative mx-auto block w-full max-w-[260px] cursor-zoom-in overflow-hidden rounded-3xl ring-1 ring-white/[0.14] shadow-[0_24px_48px_-20px_rgba(0,0,0,0.75)]"
                  style={{ aspectRatio: "4 / 5" }}
                  aria-label={`Open photo ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 448px) 80vw, 260px"
                    unoptimized
                    draggable={false}
                  />
                </button>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {count > 1 ? (
        <div className="mt-4 flex justify-center gap-1.5 px-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => goTo(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 22 : 6,
                backgroundColor:
                  i === index ? accentColor : "rgba(255,255,255,0.18)",
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
