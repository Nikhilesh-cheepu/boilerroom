"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import type { WeeklyRow } from "@/lib/data/public-site";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function WeeklyRhythm({ slots }: { slots: WeeklyRow[] }) {
  const reduce = useReducedMotion();

  if (slots.length === 0) {
    return (
      <Container>
        <p className="text-center text-sm text-br-muted">
          Weekly hours will appear here once added in admin.
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <motion.div
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        {slots.map((w, i) => (
          <motion.div
            key={w.id}
            variants={fadeUp}
            custom={i}
            className="rounded-xl border border-white/10 bg-br-surface/80 p-4 shadow-inner backdrop-blur-sm transition-colors hover:border-white/15 sm:p-5"
          >
            <p className="font-display text-base font-semibold uppercase tracking-[0.2em] text-br-accent sm:text-lg">
              {w.day}
            </p>
            <p className="mt-2 text-sm font-medium text-br-text">{w.vibe}</p>
            <p className="mt-3 text-[11px] uppercase tracking-wider text-br-muted sm:text-xs">
              {w.time}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </Container>
  );
}
