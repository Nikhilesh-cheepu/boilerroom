"use client";

import { motion, useReducedMotion } from "framer-motion";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useVideoBeat } from "@/hooks/useVideoBeat";
import { cn } from "@/lib/utils";

type Props = {
  videoSrc: string | null;
};

type LoopProps = {
  videoSrc: string;
  unmuted: boolean;
};

const HeroLoopVideo = forwardRef<HTMLVideoElement, LoopProps>(
  function HeroLoopVideo({ videoSrc, unmuted }, ref) {
    const [ready, setReady] = useState(false);
    const markReady = useCallback(() => setReady(true), []);

    return (
      <video
        ref={ref}
        className={cn(
          "absolute inset-0 z-[10] h-full w-full object-cover transition-opacity duration-500 ease-out",
          ready ? "opacity-100" : "opacity-0",
        )}
        src={videoSrc}
        autoPlay
        muted={!unmuted}
        loop
        playsInline
        preload="auto"
        onLoadedData={markReady}
        onCanPlay={markReady}
        crossOrigin={
          videoSrc.startsWith("http://") || videoSrc.startsWith("https://")
            ? "anonymous"
            : undefined
        }
      />
    );
  },
);

export function FullBleedHero({ videoSrc }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [unmuted, setUnmuted] = useState(false);
  const beat = useVideoBeat(videoRef, unmuted, videoSrc);
  const reduceMotion = useReducedMotion() ?? false;

  const applyAudioState = (nextUnmuted: boolean) => {
    const v = videoRef.current;
    if (!v) return;
    setUnmuted(nextUnmuted);
    v.muted = !nextUnmuted;
    void v.play().catch(() => {
      /* autoplay policies */
    });
  };

  useEffect(() => {
    const onToggle = () => applyAudioState(!unmuted);
    const onSet = (evt: Event) => {
      const custom = evt as CustomEvent<{ unmuted?: boolean }>;
      if (typeof custom.detail?.unmuted === "boolean") {
        applyAudioState(custom.detail.unmuted);
      }
    };
    window.addEventListener("hero-audio-toggle", onToggle as EventListener);
    window.addEventListener("hero-audio-set", onSet as EventListener);
    return () => {
      window.removeEventListener("hero-audio-toggle", onToggle as EventListener);
      window.removeEventListener("hero-audio-set", onSet as EventListener);
    };
  }, [unmuted]);

  return (
    <section
      id="top"
      className="relative isolate w-full overflow-hidden bg-[#07090e]"
    >
      <motion.div
        className={cn(
          "relative h-[100dvh] w-full overflow-hidden",
          !reduceMotion && "br-animate-frame-glow",
        )}
        initial={false}
        animate={
          reduceMotion
            ? { opacity: 1, y: 0, scale: 1 }
            : { opacity: 1, y: 0, scale: 1 }
        }
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
          <HeroLoopVideo
            key={videoSrc}
            ref={videoRef}
            videoSrc={videoSrc}
            unmuted={unmuted}
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

      </motion.div>
    </section>
  );
}
