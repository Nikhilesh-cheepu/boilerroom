"use client";

import {
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const AUTO_MS = 3800;
const DRAG_THRESHOLD = 60;
const SPRING = { type: "spring" as const, damping: 28, stiffness: 220, mass: 0.9 };

function cardMetrics(offset: number) {
  const abs = Math.abs(offset);
  const scale =
    abs === 0 ? 1 : abs === 1 ? 0.82 : abs === 2 ? 0.7 : 0.62;
  const opacity = Math.max(0.15, 1 - abs * 0.22);
  return { scale, opacity };
}

function useIsTouchDevice() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return touch;
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
  const isTouch = useIsTouchDevice();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  const go = useCallback(
    (delta: number) => {
      if (count <= 1) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  const goTo = useCallback(
    (i: number) => {
      if (count <= 1) return;
      setIndex(((i % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (reduced || paused || count <= 1) return;
    const t = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(t);
  }, [reduced, paused, count, go]);

  const xStep = isTouch ? 52 : 56;
  const use3d = !isTouch && !reduced;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -DRAG_THRESHOLD) go(1);
    else if (info.offset.x > DRAG_THRESHOLD) go(-1);
  };

  if (count === 0) return null;

  return (
    <div>
      <div
        className="relative mx-auto h-[280px] w-full max-w-md select-none overflow-hidden sm:h-[320px]"
        style={use3d ? { perspective: "1200px" } : undefined}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            height: "60%",
            width: "55%",
            backgroundColor: `${accentColor}24`,
          }}
          aria-hidden
        />

        {[-2, -1, 0, 1, 2].map((offset) => {
          const imgIndex = (index + offset + count) % count;
          const { scale, opacity } = cardMetrics(offset);
          const isCenter = offset === 0;
          const x = offset * xStep;
          const rotateY = use3d ? -26 * offset : 0;
          const zIndex = 30 - Math.abs(offset) * 10;

          return (
            <motion.div
              key={`${imgIndex}-${offset}`}
              className={`absolute left-1/2 top-1/2 w-[60%] max-w-[260px] ${
                isCenter ? "cursor-zoom-in" : "cursor-pointer"
              }`}
              style={{
                aspectRatio: "4 / 5",
                zIndex,
                transformStyle: use3d ? "preserve-3d" : undefined,
              }}
              animate={{
                x: `calc(-50% + ${x}px)`,
                y: "-50%",
                scale,
                rotateY,
                opacity,
              }}
              transition={SPRING}
              drag={isCenter && count > 1 ? "x" : false}
              dragElastic={0.18}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={isCenter ? onDragEnd : undefined}
              onClick={() => {
                if (isCenter) onOpenFullscreen(index);
                else if (offset < 0) go(-1);
                else go(1);
              }}
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
                  sizes="260px"
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
            </motion.div>
          );
        })}
      </div>

      {count > 1 ? (
        <div className="mt-3 flex justify-center gap-1.5">
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
