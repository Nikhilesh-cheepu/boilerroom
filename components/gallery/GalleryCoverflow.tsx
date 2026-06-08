"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const AUTO_MS = 3800;
/** Horizontal distance between card centers — tight overlap like Bassik coverflow. */
const X_STEP = 52;
const SLIDE_MS = 0.55;
const SLIDE_EASE = [0.22, 1, 0.36, 1] as const;
const CARD_RING = "ring-1 ring-[#7eb4ff]/55";

/** Shortest signed distance around the ring (so left slots wrap correctly). */
function circularOffset(i: number, active: number, count: number): number {
  if (count <= 1) return i === active ? 0 : 99;
  let d = i - active;
  while (d > count / 2) d -= count;
  while (d < -count / 2) d += count;
  return d;
}

function cardMetrics(offset: number) {
  const abs = Math.abs(offset);
  if (abs > 2) {
    return { scale: 0.62, opacity: 0, zIndex: 0, visible: false };
  }
  const scale = abs === 0 ? 1 : abs === 1 ? 0.82 : 0.7;
  return { scale, opacity: 1, zIndex: 40 - abs * 10, visible: true };
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
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (i: number) => {
      if (count <= 1) return;
      setIndex(((i % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (reduced || paused || count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused, count]);

  const onTouchStartTrack = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    setPaused(true);
  };

  const onTouchEndTrack = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    setPaused(false);
    if (start == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? start) - start;
    if (dx < -36) goTo(index + 1);
    else if (dx > 36) goTo(index - 1);
  };

  if (count === 0) return null;

  const transition = reduced
    ? { duration: 0 }
    : { duration: SLIDE_MS, ease: SLIDE_EASE };

  return (
    <div className="mx-auto w-full max-w-md select-none px-2 py-4">
      <div
        className="relative pb-10 sm:pb-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStartTrack}
        onTouchEnd={onTouchEndTrack}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-[42%] h-[68%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}24` }}
          aria-hidden
        />

        {/* Full-width stage — side cards must not clip */}
        <div className="relative mx-auto h-[280px] w-full overflow-visible sm:h-[320px]">
          {images.map((src, i) => {
            const offset = circularOffset(i, index, count);
            const { scale, opacity, zIndex, visible } = cardMetrics(offset);
            const isCenter = offset === 0;
            const x = offset * X_STEP;

            return (
              <motion.button
                key={`${src}-${i}`}
                type="button"
                className={cn(
                  "absolute left-1/2 top-1/2 w-[60%] max-w-[260px]",
                  visible ? "" : "pointer-events-none",
                  isCenter ? "cursor-zoom-in" : "cursor-pointer",
                )}
                style={{ aspectRatio: "4 / 5", zIndex }}
                animate={{
                  x: `calc(-50% + ${x}px)`,
                  y: "-50%",
                  scale,
                  opacity,
                }}
                transition={transition}
                onClick={() => {
                  if (!visible) return;
                  if (isCenter) onOpenFullscreen(i);
                  else goTo(i);
                }}
                aria-hidden={!visible}
                aria-label={
                  isCenter
                    ? `Open photo ${i + 1}`
                    : `Show photo ${i + 1}`
                }
              >
                <div
                  className={cn(
                    "relative h-full w-full overflow-hidden rounded-3xl",
                    CARD_RING,
                    isCenter
                      ? "shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)]"
                      : "shadow-[0_18px_40px_-15px_rgba(0,0,0,0.55)]",
                  )}
                  style={
                    isCenter
                      ? {
                          boxShadow: `0 0 0 1px ${accentColor}66, 0 30px 60px -20px rgba(0,0,0,0.85)`,
                        }
                      : undefined
                  }
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 448px) 60vw, 260px"
                    unoptimized
                    draggable={false}
                  />
                  {!isCenter ? (
                    <>
                      <div className="absolute inset-0 bg-black/45" />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                    </>
                  ) : null}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {count > 1 ? (
        <div
          className="relative z-50 mt-3 flex min-h-[10px] flex-wrap items-center justify-center gap-1.5 sm:mt-4"
          role="tablist"
          aria-label="Gallery position"
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Photo ${i + 1} of ${count}`}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300 ease-out"
              style={{
                height: 6,
                width: i === index ? 22 : 6,
                backgroundColor:
                  i === index ? accentColor : "rgba(255,255,255,0.22)",
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
