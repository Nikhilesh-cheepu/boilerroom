"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { getPublicEnv } from "@/lib/env";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function LocationTeaser() {
  const reduce = useReducedMotion();
  const env = getPublicEnv();

  return (
    <Container>
      <motion.div
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
        className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-white/10 bg-gradient-to-br from-br-surface to-br-bg p-8 sm:flex-row sm:items-center sm:p-10"
      >
        <div>
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="font-display text-2xl font-semibold uppercase tracking-wide text-br-text"
          >
            Find us
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="mt-2 max-w-md text-sm leading-relaxed text-br-muted"
          >
            {env.addressLine}
          </motion.p>
        </div>
        <motion.a
          variants={fadeUp}
          custom={2}
          href={env.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 text-sm font-semibold text-br-text transition-colors hover:bg-white/10"
        >
          Open in Maps
        </motion.a>
      </motion.div>
    </Container>
  );
}
