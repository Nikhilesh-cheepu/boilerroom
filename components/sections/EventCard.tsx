"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cardHover } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { EventItem } from "@/lib/content/site";

export function EventCard({ event, index }: { event: EventItem; index: number }) {
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
      style={{ perspective: 1000 }}
    >
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover={reduce ? undefined : "hover"}
        className={cn(
          "relative h-[280px] w-[200px] overflow-hidden rounded-xl border border-white/10 shadow-xl sm:h-[300px] sm:w-[220px]",
          "bg-gradient-to-br",
          event.gradient,
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
            {event.dateLabel}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold uppercase leading-tight text-white">
            {event.title}
          </h3>
          <p className="mt-2 text-xs text-white/75">
            {event.room} · {event.genre}
          </p>
        </div>
      </motion.div>
    </motion.article>
  );
}
