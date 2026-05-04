import { StickyDock } from "@/components/sticky/StickyDock";
import { getSiteContactForHome } from "@/lib/data/home-page";
import { fetchVenueOffers } from "@/lib/events-api/fetch-offers";
import { stickyPromoLinesFromOffers } from "@/lib/events-api/sticky-promo-line";

export async function HomeStickyDock() {
  const [contact, { offers, state }] = await Promise.all([
    getSiteContactForHome(),
    fetchVenueOffers(),
  ]);
  const promoLines = stickyPromoLinesFromOffers(offers, state);
  return <StickyDock contact={contact} promoLines={promoLines} />;
}
