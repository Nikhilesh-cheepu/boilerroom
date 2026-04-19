"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { fadeUp, staggerContainer } from "@/lib/motion";

const pillars = [
  {
    title: "Sound",
    body: "Tuned for impact — warm mids, controlled lows, no ear-fatigue hype.",
  },
  {
    title: "Hospitality",
    body: "Food that holds up at 1am. Drinks that match the tempo of the room.",
  },
  {
    title: "Crowd",
    body: "No camera policy on the floor. Be present — the night’s the show.",
  },
];

export function VenueStory() {
  const reduce = useReducedMotion();

  return (
    <Container>
      <motion.div
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.h2
          variants={fadeUp}
          custom={0}
          className="font-display text-3xl font-semibold uppercase tracking-wide text-br-text sm:text-4xl"
        >
          Built for the room
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={1}
          className="mt-4 text-base leading-relaxed text-br-muted sm:text-lg"
        >
          Boiler Room is a late-night club with a kitchen that keeps up — peak-time
          energy without the sterile “venue food” compromise. Browse nights like a
          playlist, then lock a table when you’re ready.
        </motion.p>
      </motion.div>

      <motion.div
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={staggerContainer}
        className="mt-14 grid gap-6 md:grid-cols-3"
      >
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            variants={fadeUp}
            custom={i}
            className="rounded-2xl border border-white/10 bg-br-surface/60 p-6 text-left"
          >
            <h3 className="font-display text-lg font-semibold uppercase tracking-wider text-br-text">
              {p.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-br-muted">{p.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </Container>
  );
}
