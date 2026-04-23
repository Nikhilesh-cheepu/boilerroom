import { slotAllowedForSession, timeToMinutes } from "@/lib/booking-slots";

export type DiscountOffer = {
  id: string;
  label: string;
  /** Inclusive window in 24h "HH:MM" — offer shown if chosen slot falls inside. */
  validFrom: string;
  validTo: string;
};

export const BOILER_ROOM_DISCOUNTS: DiscountOffer[] = [
  {
    id: "boiler-127",
    label: "Eat & Drink Anything @ ₹127 (12PM–7PM)",
    validFrom: "12:00",
    validTo: "19:00",
  },
  {
    id: "boiler-flat-30",
    label: "15% flat discount on à la carte",
    validFrom: "12:00",
    validTo: "22:00",
  },
];

function slotInsideWindow(
  timeSlot: string,
  validFrom: string,
  validTo: string,
): boolean {
  const t = timeToMinutes(timeSlot);
  const a = timeToMinutes(validFrom);
  const b = timeToMinutes(validTo);
  if (t < 0 || a < 0 || b < 0) return false;
  return t >= a && t <= b;
}

/** Offers valid for outlet + date (ignored for static list) + time + session. */
export function discountsAvailableForSlot(
  brandId: string,
  _date: string,
  timeSlot: string,
  session: "lunch" | "dinner",
): DiscountOffer[] {
  if (brandId !== "boiler-room") return [];
  if (!slotAllowedForSession(session, timeSlot)) return [];
  return BOILER_ROOM_DISCOUNTS.filter((d) =>
    slotInsideWindow(timeSlot, d.validFrom, d.validTo),
  );
}

export function isValidDiscountIdForSlot(
  brandId: string,
  date: string,
  timeSlot: string,
  session: "lunch" | "dinner",
  id: string,
): boolean {
  return discountsAvailableForSlot(brandId, date, timeSlot, session).some(
    (d) => d.id === id,
  );
}
