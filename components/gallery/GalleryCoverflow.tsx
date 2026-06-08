"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const programmaticScroll = useRef(false);
  const count = images.length;

  const scrollToIndex = useCallback((i: number, smooth = true) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[i] as HTMLElement | undefined;
    if (!slide) return;
    programmaticScroll.current = true;
    slide.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      inline: "center",
      block: "nearest",
    });
    setIndex(i);
    window.setTimeout(() => {
      programmaticScroll.current = false;
    }, smooth ? 520 : 0);
  }, []);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % count;
        scrollToIndex(next, true);
        return next;
      });
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, count, scrollToIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      if (programmaticScroll.current) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      Array.from(track.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const childCenter = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(center - childCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setIndex(closest);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [count]);

  if (count === 0) return null;

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

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ paddingInline: "14%" }}
        >
          {images.map((src, i) => {
            const active = i === index;
            return (
              <button
                key={`${src}-${i}`}
                type="button"
                className="w-[72%] max-w-[260px] shrink-0 snap-center"
                onClick={() => onOpenFullscreen(i)}
                aria-label={`Gallery photo ${i + 1}`}
              >
                <div
                  className={cn(
                    "relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-white/[0.14] transition-all duration-500 ease-out",
                    active
                      ? "scale-100 opacity-100 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)]"
                      : "scale-[0.86] opacity-60 shadow-[0_18px_40px_-15px_rgba(0,0,0,0.5)]",
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 448px) 72vw, 260px"
                    unoptimized
                    draggable={false}
                  />
                  {!active ? (
                    <div className="absolute inset-0 bg-black/40" aria-hidden />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {count > 1 ? (
        <div
          className="mt-3 flex justify-center gap-1.5 px-2"
          role="tablist"
          aria-label="Gallery slides"
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => scrollToIndex(i, true)}
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
