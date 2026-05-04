export type PublicEnv = {
  phoneE164: string;
  bookingMessage: string;
  instagramUrl: string;
  mapsUrl: string;
  addressLine: string;
};

/** Reads public env with sensible demo defaults for local dev. */
export function getPublicEnv(): PublicEnv {
  return {
    phoneE164: process.env.NEXT_PUBLIC_PHONE_E164 ?? "919550770707",
    bookingMessage:
      process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE_BOOKING ??
      "Hi Boiler Room — I'd like to book a table. Date / guests:",
    instagramUrl:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com",
    mapsUrl:
      process.env.NEXT_PUBLIC_MAPS_URL ??
      "https://www.google.com/maps/search/?api=1&query=Boiler+Room+club",
    addressLine:
      process.env.NEXT_PUBLIC_ADDRESS_LINE ??
      "Set NEXT_PUBLIC_ADDRESS_LINE — Your city",
  };
}
