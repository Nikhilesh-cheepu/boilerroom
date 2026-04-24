import { fetchVenueOffers } from "@/lib/events-api/fetch-offers";
import { EventsOffersCarousel } from "./EventsOffersCarousel";

export async function EventsOffersContent() {
  const { offers, state } = await fetchVenueOffers();

  return (
    <section
      id="events"
      className="scroll-mt-6 bg-[#070b12] py-10 sm:scroll-mt-8 sm:py-12"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-5">
        <header className="mb-6 sm:mb-7">
          <p className="mb-1.5 text-[10px] font-medium tracking-[0.24em] text-[#aab7da]/65 sm:text-[11px]">
            Events & offers
          </p>
          <h2 className="font-display text-[2rem] font-semibold leading-[1.05] tracking-tight text-[#f5f7ff] sm:text-[2.2rem]">
            What&apos;s on
          </h2>
        </header>

        {state === "no-base" ? (
          <div className="rounded-2xl border border-[#3d3429]/80 bg-[#12100e]/80 px-4 py-6 text-sm leading-relaxed text-[#9a8a78] sm:px-6">
            <p>
              Configure{" "}
              <code className="rounded bg-[#1f1b17] px-1.5 py-0.5 font-mono text-xs text-[#c9a227]/90">
                EVENTS_API_BASE_URL
              </code>{" "}
              or{" "}
              <code className="rounded bg-[#1f1b17] px-1.5 py-0.5 font-mono text-xs text-[#c9a227]/90">
                BASSIK_EVENTS_API_BASE_URL
              </code>{" "}
              (server env). Endpoint:{" "}
              <code className="break-all rounded bg-[#1f1b17] px-1.5 py-0.5 font-mono text-xs text-[#d4c4a8]">
                /api/venues/boiler-room
              </code>
              .
            </p>
          </div>
        ) : null}

        {state === "fetch-error" ? (
          <p className="max-w-xl text-sm leading-relaxed text-[#9a8a78]">
            We couldn&apos;t load events right now. Please try again shortly.
          </p>
        ) : null}

        {state === "empty" ? (
          <p className="max-w-xl text-sm leading-relaxed text-[#9a8a78]">
            Nothing listed right now — check back soon.
          </p>
        ) : null}

        {offers.length > 0 ? (
          <EventsOffersCarousel offers={offers} />
        ) : null}
      </div>
    </section>
  );
}
