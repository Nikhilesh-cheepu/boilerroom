"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const AUTO_MS = 3800;
const X_STEP = 68;
const VISIBLE_OFFSETS = [-2, -1, 0, 1, 2] as const;

function cardMetrics(offset: number) {
  const abs = Math.abs(offset);
  const scale = abs === 0 ? 1 : abs === 1 ? 0.86 : 0.74;
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.72 : 0.5;
  return { scale, opacity };
}

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

  const slideTransition = reduced
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <div className="mx-auto w-full max-w-md overflow-visible px-3 py-4">
      <div
        className="relative overflow-visible"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[72%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}24` }}
          aria-hidden
        />

        {/* Tall enough for 4:5 center card — overflow visible so edges never clip */}
        <div className="relative mx-auto h-[300px] w-full max-w-[280px] overflow-visible sm:h-[325px]">
          {VISIBLE_OFFSETS.map((offset) => {
            if (count < 3 && Math.abs(offset) === 2) return null;
            if (count < 2 && offset !== 0) return null;

            const imgIndex = (index + offset + count) % count;
            const { scale, opacity } = cardMetrics(offset);
            const isCenter = offset === 0;
            const zIndex = 30 - Math.abs(offset) * 10;

            return (
              <motion.button
                key={`slot-${offset}`}
                type="button"
                className={`absolute left-1/2 top-1/2 w-[58%] max-w-[240px] ${
                  isCenter ? "cursor-zoom-in" : "cursor-pointer"
                }`}
                style={{
                  aspectRatio: "4 / 5",
                  zIndex,
                }}
                animate={{
                  x: `calc(-50% + ${offset * X_STEP}px)`,
                  y: "-50%",
                  scale,
                  opacity,
                }}
                transition={slideTransition}
                onClick={() => {
                  if (isCenter) onOpenFullscreen(index);
                  else goTo(index + offset);
                }}
                aria-label={
                  isCenter
                    ? `Open photo ${index + 1}`
                    : `Show photo ${imgIndex + 1}`
                }
              >
                <div
                  className={`relative h-full w-full overflow-hidden rounded-3xl ring-1 ring-white/[0.14] ${
                    isCenter
                      ? "shadow-[0_28px_56px_-18px_rgba(0,0,0,0.8)]"
                      : "shadow-[0_16px_36px_-14px_rgba(0,0,0,0.55)]"
                  }`}
                >
                  <Image
                    src={images[imgIndex]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 448px) 58vw, 240px"
                    unoptimized
                    draggable={false}
                  />
                  {!isCenter ? (
                    <>
                      <div className="absolute inset-0 bg-[#070b12]/50" />
                      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/50 to-transparent" />
                    </>
                  ) : null}
                </div>
              </motion.button>
            );
          })}
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
