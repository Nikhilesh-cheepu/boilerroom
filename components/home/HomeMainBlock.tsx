import { Suspense } from "react";
import { GallerySection } from "@/components/gallery/GallerySection";
import { GallerySectionSkeleton } from "@/components/gallery/GallerySectionSkeleton";
import { MenuCartSection } from "@/components/menu/MenuCartSection";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { EventsOffersContent } from "@/components/sections/events-offers/EventsOffersContent";
import { EventsOffersSkeleton } from "@/components/sections/events-offers/EventsOffersSkeleton";
import { getHomePageData } from "@/lib/data/home-page";

export async function HomeMainBlock() {
  const data = await getHomePageData();

  return (
    <>
      <SectionReveal>
        <Suspense fallback={<EventsOffersSkeleton />}>
          <EventsOffersContent />
        </Suspense>
      </SectionReveal>
      <div className="pointer-events-none h-7 w-full bg-[#070b12]" />

      <Suspense fallback={<GallerySectionSkeleton />}>
        <GallerySection />
      </Suspense>
      <div className="pointer-events-none h-7 w-full bg-[#070b12]" />

      <SectionReveal delay={0.08}>
        <MenuCartSection
          menus={data.menus}
          whatsappE164={data.contact.whatsappE164}
        />
      </SectionReveal>
    </>
  );
}
