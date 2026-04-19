"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer } from "@/lib/motion";

type ContentRowProps = {
  id?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
};

export function ContentRow({
  id,
  title,
  subtitle,
  children,
  className,
}: ContentRowProps) {
  const reduce = useReducedMotion();

  return (
    <div id={id} className={cn("space-y-4", className)}>
      <Container>
        <motion.div
          initial={reduce ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-display text-2xl font-semibold uppercase tracking-wide text-br-text sm:text-3xl"
            >
              {title}
            </motion.h2>
            {subtitle ? (
              <motion.p
                variants={fadeUp}
                custom={1}
                className="mt-1 max-w-xl text-sm text-br-muted"
              >
                {subtitle}
              </motion.p>
            ) : null}
          </div>
        </motion.div>
      </Container>

      {children != null ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      ) : null}
    </div>
  );
}
