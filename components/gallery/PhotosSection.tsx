"use client";

import Link from "next/link";
import { useState } from "react";
import { GalleryCoverflow } from "./GalleryCoverflow";
import { GalleryModal } from "./GalleryModal";

type Props = {
  loading?: boolean;
  images: string[];
  accentColor?: string;
  venueName?: string;
  instagramUrl?: string;
  whatsappHref?: string;
};

function CoverflowSkeleton() {
  const slots = [
    { x: -112, scale: 0.7, z: 20 },
    { x: -56, scale: 0.82, z: 30 },
    { x: 0, scale: 1, z: 40 },
    { x: 56, scale: 0.82, z: 30 },
    { x: 112, scale: 0.7, z: 20 },
  ];
  return (
    <div className="mx-auto w-full max-w-md px-2 py-4">
      <div className="relative mx-auto h-[280px] w-full sm:h-[320px]">
        {slots.map((slot, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-[60%] max-w-[260px] animate-pulse rounded-3xl bg-white/[0.06] ring-1 ring-white/[0.1]"
            style={{
              aspectRatio: "4 / 5",
              zIndex: slot.z,
              transform: `translate(calc(-50% + ${slot.x}px), -50%) scale(${slot.scale})`,
            }}
          />
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        <div className="h-1.5 w-[22px] rounded-full bg-white/20" />
        <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
        <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

function EmptyGallery({
  accentColor,
  instagramUrl,
  whatsappHref,
}: {
  accentColor: string;
  instagramUrl?: string;
  whatsappHref?: string;
}) {
  return (
    <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-white/[0.12] bg-gradient-to-br from-[#0d1220] to-[#070b12] p-5">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl"
        style={{ backgroundColor: `${accentColor}59` }}
        aria-hidden
      />
      <p className="text-[11px] uppercase tracking-[0.12em] text-white/55">Gallery</p>
      <h3 className="mt-2 text-lg font-semibold text-white">Photos coming soon</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/55">
        Boiler Room nights, lights, and the crowd — follow us or message for photos.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {instagramUrl ? (
          <Link
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/25 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            Instagram
          </Link>
        ) : null}
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
            style={{
              borderColor: `${accentColor}88`,
              boxShadow: `0 0 24px ${accentColor}33`,
              color: accentColor,
            }}
          >
            Ask for photos
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function PhotosSection({
  loading = false,
  images,
  accentColor = "#ff6b3d",
  venueName = "Boiler Room",
  instagramUrl,
  whatsappHref,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const openGallery = (index: number) => {
    setStartIndex(index);
    setModalOpen(true);
  };

  return (
    <>
      <section className="px-1 py-2">
        {loading ? (
          <CoverflowSkeleton />
        ) : images.length === 0 ? (
          <EmptyGallery
            accentColor={accentColor}
            instagramUrl={instagramUrl}
            whatsappHref={whatsappHref}
          />
        ) : (
          <GalleryCoverflow
            images={images}
            accentColor={accentColor}
            onOpenFullscreen={openGallery}
          />
        )}
      </section>

      {modalOpen && images.length > 0 ? (
        <GalleryModal
          images={images}
          brandName={venueName}
          initialIndex={startIndex}
          onClose={() => setModalOpen(false)}
        />
      ) : null}
    </>
  );
}
