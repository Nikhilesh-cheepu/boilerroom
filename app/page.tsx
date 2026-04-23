import { Suspense } from "react";
import { FullBleedHero } from "@/components/hero/FullBleedHero";
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
        <main className="overflow-x-hidden bg-[#07090e] pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:pb-[calc(6rem+env(safe-area-inset-bottom))]">
          <FullBleedHero videoSrc={data.heroVideoPath} />
          <div className="pointer-events-none mx-auto h-12 w-full max-w-[560px] -translate-y-10 bg-gradient-to-b from-transparent via-[#07090e]/70 to-[#07090e]" />

          <SectionReveal>
            <Suspense fallback={<EventsOffersSkeleton />}>
              <EventsOffersContent />
            </Suspense>
          </SectionReveal>
          <div className="pointer-events-none h-14 w-full bg-gradient-to-b from-transparent via-[#080b13]/80 to-[#080b13]" />

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
