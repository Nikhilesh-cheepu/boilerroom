/** Normalized offer from GET /api/venues/boiler-room */
export type VenueOffer = {
  id: string;
  imageUrl: string | null;
  title: string | null;
  description: string | null;
  eventDate: string | null;
  entryLabel: string | null;
  capacityText: string | null;
  endDate: string | null;
  /** Optional short line for sticky / promo UI (API may send under several keys). */
  badgeText: string | null;
};

export type VenueOffersLoadState =
  | "no-base"
  | "fetch-error"
  | "empty"
  | "ok";

export type VenueOffersResult = {
  offers: VenueOffer[];
  state: VenueOffersLoadState;
};
