import { getPublicEnv } from "@/lib/env";
import { digitsOnly, normalizeIndianPhoneDigits } from "@/lib/phone-in";

export type ResolvedSiteContact = {
  phoneE164: string;
  whatsappE164: string;
  phoneDisplay: string;
  whatsappDisplay: string;
  instagramUrl: string;
  mapsUrl: string;
  addressLine: string;
  bookingMessage: string;
};

function fallbackDisplayFromDigits(digits: string) {
  if (!digits) return "";
  return `+${digits}`;
}

type SiteSettingsContactRow = {
  contactPhoneE164: string | null;
  contactWhatsappE164: string | null;
  contactPhoneDisplay: string | null;
  contactWhatsappDisplay: string | null;
  contactInstagramUrl: string | null;
  contactMapsUrl: string | null;
  contactAddressLine: string | null;
  contactBookingMessage: string | null;
};

/** Merge DB-backed contact with public env defaults (env wins only when DB field is empty). */
export function resolveSiteContact(
  row: SiteSettingsContactRow | null | undefined,
): ResolvedSiteContact {
  const env = getPublicEnv();
  const phoneRaw = row?.contactPhoneE164?.trim() || env.phoneE164;
  const phoneE164 =
    normalizeIndianPhoneDigits(phoneRaw) ||
    digitsOnly(phoneRaw);
  const whatsRaw = row?.contactWhatsappE164?.trim();
  const whatsSource = whatsRaw || row?.contactPhoneE164?.trim() || env.phoneE164;
  const whatsappE164 =
    normalizeIndianPhoneDigits(whatsSource) || digitsOnly(whatsSource);

  const phoneDisplay =
    row?.contactPhoneDisplay?.trim() ||
    fallbackDisplayFromDigits(phoneE164) ||
    fallbackDisplayFromDigits(digitsOnly(env.phoneE164));

  const whatsappDisplay =
    row?.contactWhatsappDisplay?.trim() ||
    fallbackDisplayFromDigits(whatsappE164) ||
    phoneDisplay;

  const envPhone =
    normalizeIndianPhoneDigits(env.phoneE164) || digitsOnly(env.phoneE164);
  return {
    phoneE164: phoneE164 || envPhone,
    whatsappE164: whatsappE164 || phoneE164 || envPhone,
    phoneDisplay,
    whatsappDisplay,
    instagramUrl:
      row?.contactInstagramUrl?.trim() || env.instagramUrl,
    mapsUrl: row?.contactMapsUrl?.trim() || env.mapsUrl,
    addressLine: row?.contactAddressLine?.trim() || env.addressLine,
    bookingMessage:
      row?.contactBookingMessage?.trim() || env.bookingMessage,
  };
}

export function telHrefFromE164(e164Digits: string) {
  const d = digitsOnly(e164Digits);
  if (!d) return "#";
  return `tel:+${d}`;
}
