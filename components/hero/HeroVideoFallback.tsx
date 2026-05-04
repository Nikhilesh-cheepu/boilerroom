/**
 * Instant paint while hero video URL resolves (streaming).
 * Mirrors FullBleedHero shell so layout does not jump.
 */
export function HeroVideoFallback() {
  return (
    <section
      id="top"
      className="relative isolate w-full overflow-hidden bg-[#07090e]"
      aria-hidden
    >
      <div className="relative h-[100dvh] w-full overflow-hidden">
        <div className="pointer-events-none absolute -left-10 top-1/4 z-[5] h-36 w-36 rounded-full bg-[#9cb4ff24] blur-3xl br-animate-orb-a" />
        <div className="pointer-events-none absolute -right-12 bottom-1/3 z-[5] h-40 w-40 rounded-full bg-[#b9a0ff1c] blur-3xl br-animate-orb-b" />
        <div
          className="pointer-events-none absolute inset-0 z-[1] motion-safe:animate-pulse"
          style={{
            opacity: 0.45,
            background: `
              radial-gradient(ellipse 120% 80% at 50% 100%, rgba(156, 187, 255, 0.16) 0%, transparent 55%),
              radial-gradient(ellipse 80% 60% at 20% 30%, rgba(147, 115, 255, 0.12) 0%, transparent 45%),
              linear-gradient(180deg, #101525 0%, #0b0f17 45%, #080a0f 100%)
            `,
          }}
        />
        <div className="pointer-events-none absolute inset-0 z-[11] bg-gradient-to-t from-[#07090e]/95 via-transparent to-[#07090e]/35" />
      </div>
    </section>
  );
}
