"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { VenueOffer } from "@/lib/events-api/types";
import { cn } from "@/lib/utils";

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

function formatEventDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return dateFmt.format(d);
}

function OfferCard({
  offer,
  index,
  reduceMotion,
}: {
  offer: VenueOffer;
  index: number;
  reduceMotion: boolean;
}) {
  const dateLine = formatEventDate(offer.eventDate);
  const hasImage = Boolean(offer.imageUrl?.trim());

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: reduceMotion ? 0 : index * 0.07,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-[72vw] max-w-[240px] shrink-0 snap-center sm:w-[200px] sm:max-w-[220px]"
    >
      <motion.div
        whileHover={
          reduceMotion
            ? undefined
            : {
                y: -8,
                rotate: index % 2 === 0 ? -1.8 : 1.8,
                transition: { type: "spring", stiffness: 400, damping: 26 },
              }
        }
        whileTap={reduceMotion ? undefined : { scale: 0.97, rotate: 0 }}
        className="group relative aspect-[9/16] overflow-hidden rounded-2xl border border-[#cad6ff2e] bg-[#0e121c] shadow-[0_20px_50px_-24px_rgba(0,0,0,0.65)]"
      >
        {hasImage ? (
          <Image
            src={offer.imageUrl!.trim()}
            alt={offer.title ? offer.title : "Event poster"}
            fill
            sizes="(max-width: 640px) 72vw, 220px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            loading="lazy"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a2338] to-[#080b12] px-3 text-center">
            <span className="text-xs font-medium uppercase tracking-wider text-[#5c678a]">
              No poster
            </span>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07090e]/95 via-[#0a0e18]/5 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          {dateLine ? (
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b8c7ff] sm:text-[11px]">
              {dateLine}
            </p>
          ) : null}
          {offer.title ? (
            <h3
              className={cn(
                "line-clamp-2 font-display text-base font-bold leading-tight text-[#f3f5fd] sm:text-lg",
              )}
            >
              {offer.title}
            </h3>
          ) : null}
          {offer.entryLabel ? (
            <p className="mt-1 line-clamp-2 text-xs text-[#9ca6c6]">{offer.entryLabel}</p>
          ) : null}
        </div>
      </motion.div>
    </motion.article>
  );
}

export function EventsOffersCarousel({ offers }: { offers: VenueOffer[] }) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      role="region"
      aria-label="Events and offers"
      className={cn(
        "shelf-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pt-1",
        "[-ms-overflow-style:none] [scrollbar-width:thin] sm:gap-5",
        "[&::-webkit-scrollbar]:h-1.5",
      )}
    >
      {offers.map((offer, i) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          index={i}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  );
}
