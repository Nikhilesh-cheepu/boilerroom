"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import type { FaqItem } from "@/lib/content/site";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function FaqSection({ items }: { items: FaqItem[] }) {
  const reduce = useReducedMotion();

  if (items.length === 0) {
    return (
      <Container>
        <p className="text-center text-sm text-br-muted">
          FAQs will show here once added in admin.
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
        className="mx-auto max-w-3xl"
      >
        <motion.h2
          variants={fadeUp}
          custom={0}
          className="font-display text-xl font-semibold uppercase tracking-wide text-br-text sm:text-2xl md:text-3xl"
        >
          Practicalities
        </motion.h2>
        <motion.p variants={fadeUp} custom={1} className="mt-2 text-sm text-br-muted">
          Quick answers before you step out.
        </motion.p>
        <div className="mt-8 space-y-3">
          {items.map((item, i) => (
            <motion.div key={item.id} variants={fadeUp} custom={i + 2}>
              <details className="group rounded-xl border border-white/10 bg-br-elevated/80 px-4 py-3 backdrop-blur-sm open:border-br-accent/40 sm:px-5 sm:py-4">
                <summary className="cursor-pointer list-none font-medium text-br-text outline-none transition-colors marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {item.q}
                    <span
                      className="text-br-muted transition-transform group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-br-muted">{item.a}</p>
              </details>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Container>
  );
}
