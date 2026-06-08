"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const AUTO_MS = 3800;
/** Center + 4 background cards (±2 each side). */
const VISIBLE_OFFSETS = [-2, -1, 0, 1, 2] as const;

function useTouchStep() {
  const [step, setStep] = useState(56);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => setStep(mq.matches ? 52 : 56);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return step;
}

function cardMetrics(offset: number) {
  const abs = Math.abs(offset);
  const scale = abs === 0 ? 1 : abs === 1 ? 0.82 : 0.7;
  return { scale };
}

function slotVisible(offset: number, count: number): boolean {
  if (offset === 0) return true;
  if (count <= 1) return false;
  if (count === 2) return Math.abs(offset) === 1;
  if (count === 3) return Math.abs(offset) <= 1;
  return true;
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
  const xStep = useTouchStep();
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
    <div className="mx-auto w-full max-w-md px-2 py-4">
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[68%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}24` }}
          aria-hidden
        />

        <div className="relative mx-auto h-[280px] w-full sm:h-[320px]">
          {VISIBLE_OFFSETS.map((offset) => {
            if (!slotVisible(offset, count)) return null;

            const imgIndex = (index + offset + count) % count;
            const { scale } = cardMetrics(offset);
            const isCenter = offset === 0;
            const zIndex = 40 - Math.abs(offset) * 10;
            const x = offset * xStep;

            return (
              <motion.button
                key={`slot-${offset}`}
                type="button"
                className={`absolute left-1/2 top-1/2 w-[60%] max-w-[260px] ${
                  isCenter ? "cursor-zoom-in" : "cursor-pointer"
                }`}
                style={{
                  aspectRatio: "4 / 5",
                  zIndex,
                }}
                animate={{
                  x: `calc(-50% + ${x}px)`,
                  y: "-50%",
                  scale,
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
                      ? "shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)]"
                      : "shadow-[0_18px_40px_-15px_rgba(0,0,0,0.55)]"
                  }`}
                >
                  <Image
                    src={images[imgIndex]}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 448px) 60vw, 260px"
                    unoptimized
                    draggable={false}
                  />
                  {!isCenter ? (
                    <>
                      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />
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
        <div className="mt-3 flex justify-center gap-1.5 px-2">
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
