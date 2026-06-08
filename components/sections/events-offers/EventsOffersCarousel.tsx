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
  const ymd = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const d = ymd
    ? new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]))
    : new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return dateFmt.format(d);
}

function getDjLine(offer: VenueOffer): string | null {
  const raw = (offer.description ?? offer.entryLabel ?? "").trim();
  if (!raw) return null;
  return raw.replace(/\s+/g, " ").slice(0, 42);
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
  const djLine = getDjLine(offer);
  const hasImage = Boolean(offer.imageUrl?.trim());

  return (
    <motion.article
      initial={false}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: reduceMotion ? 0 : index * 0.07,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-[68vw] max-w-[220px] shrink-0 snap-start sm:w-[190px] sm:max-w-[212px]"
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
        className="group relative aspect-[9/16] overflow-hidden rounded-2xl border border-[#cad6ff2b] bg-[#0e121c] shadow-[0_18px_36px_-22px_rgba(0,0,0,0.75)]"
      >
        {hasImage ? (
          <Image
            src={offer.imageUrl!.trim()}
            alt={offer.title ? offer.title : "Event poster"}
            fill
            sizes="(max-width: 640px) 72vw, 220px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06080f]/96 via-[#06080f]/48 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
          {dateLine ? (
            <p className="mb-1 text-[10px] font-medium tracking-[0.16em] text-[#b8c7ff]/90 sm:text-[11px]">
              {dateLine}
            </p>
          ) : null}
          {offer.title ? (
            <h3 className={cn("line-clamp-2 font-display text-[1.02rem] font-semibold leading-tight text-[#f3f5fd] sm:text-[1.08rem]")}>
              {offer.title}
            </h3>
          ) : null}
          {djLine ? (
            <p className="mt-1.5 line-clamp-1 text-[12px] text-[#9ca6c6]">
              DJ: {djLine}
            </p>
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
        "shelf-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 pt-0.5",
        "[-ms-overflow-style:none] [scrollbar-width:thin] sm:gap-3.5",
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
