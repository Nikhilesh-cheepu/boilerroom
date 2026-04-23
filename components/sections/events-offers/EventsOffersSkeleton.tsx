/** Loading UI for Suspense — matches events section layout. */
export function EventsOffersSkeleton() {
  return (
    <section
      className="scroll-mt-6 border-b border-[#3d3429]/50 py-14 sm:scroll-mt-8 sm:py-20"
      style={{
        background:
          "linear-gradient(180deg, #0c0a09 0%, #14110e 42%, #0a0908 100%)",
      }}
      aria-hidden
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 h-3 w-28 animate-pulse rounded-full bg-[#c9a227]/15 sm:mb-10" />
        <div className="mb-3 h-10 max-w-md animate-pulse rounded-lg bg-[#3d3429]/40 sm:h-12" />
        <div className="mb-10 h-4 max-w-xs animate-pulse rounded bg-[#2a241c]/80" />
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-[9/16] w-[72vw] max-w-[240px] shrink-0 snap-center overflow-hidden rounded-2xl border border-[#3d3429]/60 bg-[#141210]/80 sm:w-[200px]"
            >
              <div className="h-full w-full animate-pulse bg-gradient-to-b from-[#2a241c]/80 to-[#0c0a09]/60" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
