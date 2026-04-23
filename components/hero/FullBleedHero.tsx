"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useVideoBeat } from "@/hooks/useVideoBeat";
import { cn } from "@/lib/utils";

type Props = {
  videoSrc: string | null;
};

export function FullBleedHero({ videoSrc }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [unmuted, setUnmuted] = useState(false);
  const beat = useVideoBeat(videoRef, unmuted);
  const reduceMotion = useReducedMotion() ?? false;

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const next = !unmuted;
    setUnmuted(next);
    v.muted = !next;
    void v.play().catch(() => {
      /* autoplay policies */
    });
  }, [unmuted]);

  return (
    <section
      id="top"
      className="relative isolate w-full overflow-hidden bg-[#07090e] px-3 pt-2 sm:px-4"
    >
      <motion.div
        className={cn(
          "relative mx-auto aspect-[9/16] w-full max-h-[100dvh] max-w-[560px] overflow-hidden rounded-[24px] border border-[#cad6ff24]",
          !reduceMotion && "br-animate-frame-glow",
        )}
        initial={
          reduceMotion
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 0.75, y: 22, scale: 0.98 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 32, mass: 0.9 }}
      >
        <div
          className="pointer-events-none absolute -left-10 top-1/4 z-[5] h-36 w-36 rounded-full bg-[#9cb4ff24] blur-3xl br-animate-orb-a"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-12 bottom-1/3 z-[5] h-40 w-40 rounded-full bg-[#b9a0ff1c] blur-3xl br-animate-orb-b"
          aria-hidden
        />
        {/* Beat-reactive cool glow layers */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            opacity: 0.35 + beat * 0.55,
            background: `
              radial-gradient(ellipse 120% 80% at 50% 100%, rgba(156, 187, 255, ${0.13 + beat * 0.2}) 0%, transparent 55%),
              radial-gradient(ellipse 80% 60% at 20% 30%, rgba(147, 115, 255, ${0.1 + beat * 0.18}) 0%, transparent 45%),
              radial-gradient(ellipse 70% 50% at 85% 20%, rgba(134, 171, 255, ${0.1 + beat * 0.15}) 0%, transparent 40%),
              linear-gradient(180deg, #101525 0%, #0b0f17 45%, #080a0f 100%)
            `,
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] mix-blend-soft-light"
          style={{
            opacity: 0.15 + beat * 0.35,
            boxShadow: `inset 0 0 ${80 + beat * 120}px rgba(166, 190, 255, ${0.15 + beat * 0.22})`,
          }}
          aria-hidden
        />

        {videoSrc ? (
          <video
            ref={videoRef}
            className="absolute inset-0 z-[10] h-full w-full object-cover"
            src={videoSrc}
            autoPlay
            muted={!unmuted}
            loop
            playsInline
            preload="auto"
            crossOrigin="anonymous"
          />
        ) : (
          <div
            className="absolute inset-0 z-[10] flex items-center justify-center bg-gradient-to-br from-[#2a221e] via-[#141110] to-[#0a0908]"
            aria-hidden
          >
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#8b7355]/80">
              Upload video in admin
            </p>
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0 z-[11] bg-gradient-to-t from-[#07090e]/95 via-transparent to-[#07090e]/35"
          aria-hidden
        />

        <div className="pointer-events-auto absolute bottom-6 right-4 z-[30] sm:bottom-8 sm:right-6">
          <motion.button
            type="button"
            onClick={toggleMute}
            disabled={!videoSrc}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            whileHover={reduceMotion ? undefined : { scale: 1.06 }}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border border-[#cad6ff45] bg-[#0e1320]/80 text-[#d6e1ff] shadow-lg shadow-black/40 backdrop-blur-md transition hover:border-[#e3ebff70] hover:bg-[#151c2b]/90 disabled:cursor-not-allowed disabled:opacity-40",
              unmuted && "border-[#e3ebff70] text-[#f4f7ff]",
            )}
            aria-label={unmuted ? "Mute video" : "Unmute video"}
          >
            {unmuted ? (
              <Volume2 className="h-5 w-5" strokeWidth={2} />
            ) : (
              <VolumeX className="h-5 w-5" strokeWidth={2} />
            )}
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
