"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import type { MenuCategory } from "@/lib/content/site";
import { fadeUp, staggerContainer } from "@/lib/motion";

function MenuCategoryBlock({
  category,
  index,
}: {
  category: MenuCategory;
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={staggerContainer}
      className="rounded-2xl border border-white/10 bg-br-elevated/90 p-6 shadow-lg backdrop-blur-md sm:p-8"
    >
      <motion.h3
        variants={fadeUp}
        custom={0}
        className="font-display text-xl font-semibold uppercase tracking-wide text-br-text"
      >
        {category.label}
      </motion.h3>
      <ul className="mt-6 space-y-4">
        {category.items.map((item, i) => (
          <motion.li
            key={item.id}
            variants={fadeUp}
            custom={i + 1 + index}
            className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/5 pb-4 last:border-0 last:pb-0"
          >
            <div>
              <p className="font-medium text-br-text">{item.name}</p>
              {item.note ? (
                <p className="mt-0.5 text-sm text-br-muted">{item.note}</p>
              ) : null}
            </div>
            <span className="font-display text-sm font-semibold text-br-accent">
              {item.price}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export function MenuShelves({ categories }: { categories: MenuCategory[] }) {
  return (
    <Container>
      <div className="grid gap-8 lg:grid-cols-2">
        {categories.map((cat, i) => (
          <MenuCategoryBlock key={cat.id} category={cat} index={i} />
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-br-muted">
        Menu rotates — ask your server for tonight&apos;s additions &amp; dietary
        notes.
      </p>
    </Container>
  );
}
