"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { GalleryImageDTO } from "@/lib/gallery-data";

type Props = {
  images: GalleryImageDTO[];
};

export function GalleryFloatingPreviewClient({ images }: Props) {
  const reduced = useReducedMotion() ?? false;
  const limited = useMemo(() => images.slice(0, 14), [images]);
  const [centerIndex, setCenterIndex] = useState(0);

  useEffect(() => {
    if (limited.length <= 1) return;
    const t = window.setInterval(() => {
      setCenterIndex((v) => (v + 1) % limited.length);
    }, 1300);
    return () => window.clearInterval(t);
  }, [limited.length]);

  const center = limited[centerIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#b8c7ff33] bg-[#0a0f1a]/65 p-4 shadow-[0_28px_64px_-34px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(191,208,255,0.12),transparent_50%)]" />

      <div className="relative mx-auto grid min-h-[19rem] place-items-center sm:min-h-[22rem]">
        {limited.map((img, i) => {
          if (i === centerIndex) return null;
          const n = limited.length;
          const angle = (i / Math.max(1, n)) * Math.PI * 2;
          const radius = 108 + (i % 3) * 22;
          const jitterX = ((i % 2 === 0 ? 1 : -1) * ((i * 7) % 12)) / 2;
          const jitterY = ((i % 3 === 0 ? -1 : 1) * ((i * 5) % 14)) / 2;
          const x = Math.cos(angle) * radius + jitterX;
          const y = Math.sin(angle) * (radius * 0.68) + jitterY;
          const rot = ((i * 11) % 10) - 5;

          return (
            <motion.div
              key={img.id}
              className="absolute"
              style={{ x, y, rotate: rot }}
              initial={reduced ? false : { opacity: 0, scale: 0.85 }}
              animate={
                reduced
                  ? { opacity: 0.75, scale: 1 }
                  : {
                      opacity: 0.75,
                      y: [y - 5, y + 5, y - 5],
                      rotate: [rot - 1.3, rot + 1.3, rot - 1.3],
                    }
              }
              transition={{
                opacity: { duration: 0.35, delay: i * 0.03 },
                y: { duration: 4 + (i % 4), repeat: Infinity, ease: "easeInOut" },
                rotate: {
                  duration: 4.8 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <div className="relative h-[72px] w-[72px] overflow-hidden rounded-xl border border-[#cad6ff35] bg-[#11182a] shadow-lg shadow-black/35 sm:h-[84px] sm:w-[84px]">
                <Image
                  src={img.url}
                  alt={img.alt ?? "Gallery preview"}
                  fill
                  sizes="84px"
                  className="object-cover"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </motion.div>
          );
        })}

        <div className="relative z-10">
          <div className="relative h-[170px] w-[170px] overflow-hidden rounded-2xl border border-[#e8eeff55] bg-[#121b2c] shadow-[0_18px_45px_-20px_rgba(0,0,0,0.8)] sm:h-[210px] sm:w-[210px]">
            <AnimatePresence mode="wait">
              {center ? (
                <motion.div
                  key={center.id}
                  className="absolute inset-0"
                  initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={center.url}
                    alt={center.alt ?? "Gallery center preview"}
                    fill
                    sizes="210px"
                    className="object-cover"
                    priority={centerIndex === 0}
                    unoptimized
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex justify-center sm:mt-5">
        <Link
          href="/gallery"
          className="rounded-full border border-[#c7d4ff55] bg-[#bacbff1c] px-5 py-2.5 text-sm font-semibold text-[#edf2ff] transition hover:border-[#e8eeff80] hover:bg-[#bacbff2b]"
        >
          Open full gallery
        </Link>
      </div>
    </div>
  );
}
