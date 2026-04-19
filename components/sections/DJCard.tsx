"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cardHover } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { DJItem } from "@/lib/content/site";

export function DJCard({ dj, index }: { dj: DJItem; index: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        delay: reduce ? 0 : index * 0.05,
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="snap-start shrink-0"
    >
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover={reduce ? undefined : "hover"}
        className={cn(
          "relative flex h-[200px] w-[160px] flex-col justify-end overflow-hidden rounded-xl border border-white/10 p-4 shadow-lg sm:h-[220px] sm:w-[180px]",
          "bg-gradient-to-br",
          dj.gradient,
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        <div className="relative">
          <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">
            {dj.name}
          </h3>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-wider text-white/70">
            {dj.tags.join(" · ")}
          </p>
        </div>
      </motion.div>
    </motion.article>
  );
}
