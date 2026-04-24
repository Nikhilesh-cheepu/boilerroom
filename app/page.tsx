import { Suspense } from "react";
import { FullBleedHero } from "@/components/hero/FullBleedHero";
import { GallerySection } from "@/components/gallery/GallerySection";
import { MenuCartProvider } from "@/components/menu/menu-cart-context";
import { MenuCartSection } from "@/components/menu/MenuCartSection";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { SiteHeader } from "@/components/nav/SiteHeader";
import { EventsOffersContent } from "@/components/sections/events-offers/EventsOffersContent";
import { EventsOffersSkeleton } from "@/components/sections/events-offers/EventsOffersSkeleton";
import { StickyDock } from "@/components/sticky/StickyDock";
import { getHomePageData } from "@/lib/data/home-page";

/** ISR: faster repeat loads; CMS actions still call revalidatePath("/"). */
export const revalidate = 30;

export default async function Home() {
  const data = await getHomePageData();

  return (
    <>
      <SiteHeader />
      <MenuCartProvider>
        <main className="overflow-x-hidden bg-[#07090e] pb-[calc(4.4rem+env(safe-area-inset-bottom))] sm:pb-[calc(5rem+env(safe-area-inset-bottom))]">
          <FullBleedHero videoSrc={data.heroVideoPath} />
          <div className="pointer-events-none h-7 w-full bg-[#070b12]" />

          <SectionReveal>
            <Suspense fallback={<EventsOffersSkeleton />}>
              <EventsOffersContent />
            </Suspense>
          </SectionReveal>
          <div className="pointer-events-none h-7 w-full bg-[#070b12]" />

          <SectionReveal delay={0.06}>
            <GallerySection />
          </SectionReveal>
          <div className="pointer-events-none h-7 w-full bg-[#070b12]" />

          <SectionReveal delay={0.08}>
            <MenuCartSection
              menus={data.menus}
              whatsappE164={data.contact.whatsappE164}
            />
          </SectionReveal>
        </main>
      </MenuCartProvider>
      <StickyDock contact={data.contact} />
    </>
  );
}
