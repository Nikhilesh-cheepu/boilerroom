"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { fadeUp } from "@/lib/motion";

type HeroProps = {
  tagline: string;
  heroSub: string;
  videoSrc: string | null;
};

export function Hero({ tagline, heroSub, videoSrc }: HeroProps) {
  const reduce = useReducedMotion();

  return (
    <div
      id="top"
      className="relative isolate min-h-[70vh] overflow-hidden border-b border-br-border sm:min-h-[78vh]"
    >
      {videoSrc ? (
        <video
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(229,9,20,0.35),transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_50%,rgba(120,50,255,0.12),transparent_50%),linear-gradient(to_bottom,rgba(5,5,5,0.55),rgba(10,10,10,0.92))]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <Container className="relative z-10 flex min-h-[70vh] flex-col justify-end pb-20 pt-24 sm:min-h-[78vh] sm:pb-28 sm:pt-32">
        <motion.div
          initial={reduce ? false : "hidden"}
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
          }}
          className="max-w-3xl"
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="mb-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-br-accent sm:text-xs"
          >
            Club · Kitchen · Sound
          </motion.p>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-br-text sm:text-6xl md:text-7xl"
          >
            {tagline}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-4 max-w-xl text-sm leading-relaxed text-br-muted sm:mt-5 sm:text-lg"
          >
            {heroSub}
          </motion.p>
          <motion.div
            variants={fadeUp}
            custom={3}
            className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap"
          >
            <Link
              href="#events"
              className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-br-accent px-6 text-sm font-semibold text-white shadow-[0_0_40px_var(--br-glow)] transition-transform active:scale-[0.98] sm:min-h-12 sm:px-7"
            >
              See what&apos;s on
            </Link>
            <Link
              href="#menu"
              className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-semibold text-br-text backdrop-blur-sm transition-colors active:bg-white/10 sm:min-h-12 sm:px-7"
            >
              Food &amp; drinks
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
