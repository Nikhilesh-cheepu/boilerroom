"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const AUTO_MS = 3800;
const SLIDE_W = 220;
const GAP = 12;
const STEP = SLIDE_W + GAP;

const SLIDE_EASE = [0.22, 1, 0.36, 1] as const;
const SLIDE_MS = 0.55;

function stackStyle(distance: number) {
  if (distance === 0) return { scale: 1, opacity: 1, zIndex: 30 };
  if (distance === 1) return { scale: 0.82, opacity: 0.88, zIndex: 20 };
  if (distance === 2) return { scale: 0.7, opacity: 0.62, zIndex: 10 };
  return { scale: 0.65, opacity: 0, zIndex: 0 };
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(0);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setViewportW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const trackX =
    viewportW > 0 ? viewportW / 2 - index * STEP - SLIDE_W / 2 : 0;

  const touchStartX = useRef<number | null>(null);

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

  const goTo = useCallback(
    (i: number) => {
      if (count <= 1) return;
      setIndex(((i % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;

  return (
    <div className="mx-auto w-full max-w-md select-none px-3 py-4">
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStartTrack}
        onTouchEnd={onTouchEndTrack}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[68%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: `${accentColor}24` }}
          aria-hidden
        />

        <div
          ref={viewportRef}
          className="relative h-[280px] overflow-hidden sm:h-[300px]"
          style={{ opacity: viewportW > 0 ? 1 : 0 }}
        >
          <motion.div
            className="absolute top-1/2 flex -translate-y-1/2 items-center will-change-transform"
            animate={{ x: trackX }}
            transition={{ duration: SLIDE_MS, ease: SLIDE_EASE }}
          >
            {images.map((src, i) => {
              const distance = Math.abs(i - index);
              const style = stackStyle(distance);
              const isCenter = distance === 0;

              return (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  className={cn(
                    "relative shrink-0",
                    distance > 2 && "pointer-events-none",
                  )}
                  style={{
                    width: SLIDE_W,
                    marginRight: GAP,
                    zIndex: style.zIndex,
                  }}
                  onClick={() =>
                    isCenter ? onOpenFullscreen(i) : goTo(i)
                  }
                  aria-label={
                    isCenter
                      ? `Open photo ${i + 1}`
                      : `Show photo ${i + 1}`
                  }
                >
                  <motion.div
                    className={cn(
                      "relative aspect-[4/5] overflow-hidden rounded-3xl",
                      isCenter
                        ? "cursor-zoom-in shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)] ring-2"
                        : "cursor-pointer shadow-[0_16px_32px_-14px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.14]",
                    )}
                    style={
                      isCenter
                        ? {
                            boxShadow: `0 0 0 1px ${accentColor}55, 0 30px 60px -20px rgba(0,0,0,0.85)`,
                          }
                        : undefined
                    }
                    animate={{
                      scale: style.scale,
                      opacity: style.opacity,
                    }}
                    transition={{ duration: SLIDE_MS, ease: SLIDE_EASE }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="220px"
                      unoptimized
                      draggable={false}
                    />
                    {!isCenter ? (
                      <>
                        <div className="absolute inset-0 bg-black/45" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                      </>
                    ) : null}
                  </motion.div>
                </button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {count > 1 ? (
        <div
          className="relative z-10 mt-5 flex min-h-[8px] flex-wrap items-center justify-center gap-1.5"
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
