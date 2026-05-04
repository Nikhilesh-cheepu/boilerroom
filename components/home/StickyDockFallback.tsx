/** Reserves dock space while contact/offers load (promo pill is optional). */
export function StickyDockFallback() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1"
      aria-hidden
    >
      <div className="h-14 w-full max-w-md rounded-2xl border border-white/[0.08] bg-zinc-950/40 backdrop-blur-md" />
    </div>
  );
}
