import { Suspense } from "react";
import { HeroStreamSection } from "@/components/hero/HeroStreamSection";
import { HeroVideoFallback } from "@/components/hero/HeroVideoFallback";
import { HomeMainBlock } from "@/components/home/HomeMainBlock";
import { HomeStickyDock } from "@/components/home/HomeStickyDock";
import { StickyDockFallback } from "@/components/home/StickyDockFallback";
import { MenuCartProvider } from "@/components/menu/menu-cart-context";
import { SiteHeader } from "@/components/nav/SiteHeader";

/** ISR: faster repeat loads; CMS actions still call revalidatePath("/"). */
export const revalidate = 30;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <MenuCartProvider>
        <main className="overflow-x-hidden bg-[#07090e] pb-[calc(5.75rem+env(safe-area-inset-bottom))] sm:pb-[calc(6.25rem+env(safe-area-inset-bottom))]">
          <Suspense fallback={<HeroVideoFallback />}>
            <HeroStreamSection />
          </Suspense>
          <div className="pointer-events-none h-7 w-full bg-[#070b12]" />

          <Suspense fallback={<HomeMainBlockFallback />}>
            <HomeMainBlock />
          </Suspense>
        </main>
      </MenuCartProvider>
      <Suspense fallback={<StickyDockFallback />}>
        <HomeStickyDock />
      </Suspense>
    </>
  );
}

function HomeMainBlockFallback() {
  return (
    <div className="space-y-7 px-4 py-10 sm:px-6" aria-hidden>
      <div className="mx-auto h-40 max-w-5xl animate-pulse rounded-3xl bg-white/[0.04]" />
      <div className="mx-auto h-52 max-w-6xl animate-pulse rounded-3xl bg-white/[0.03]" />
      <div className="mx-auto h-72 max-w-6xl animate-pulse rounded-3xl bg-white/[0.03]" />
    </div>
  );
}
