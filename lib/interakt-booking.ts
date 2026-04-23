import { formatBookingDateShort, formatTime12h } from "@/lib/booking-format";
import { BOILER_ROOM_DISCOUNTS } from "@/lib/reservation-discounts";

/**
 * Interakt often gives `INTERAKT_API_KEY` as the Base64 credential
 * (`base64("publicKey:secret")`) — send `Authorization: Basic <that>`.
 * If yours is a raw public key only, we fall back to `Basic base64(key:)`.
 * Optional: set `INTERAKT_AUTHORIZATION` to the full header value (`Basic …`).
 *
 * Env name must include the **E** (INTER**A**KT = “Interakt”). We also read
 * common typos: INTERACT_* (C), INTRAKT_* (missing E).
 */
function basicAuthHeader(): string | null {
  const full =
    process.env.INTERAKT_AUTHORIZATION?.trim() ||
    process.env.INTERACT_AUTHORIZATION?.trim() ||
    process.env.INTRAKT_AUTHORIZATION?.trim();
  if (full) {
    return full.toLowerCase().startsWith("basic ") ? full : `Basic ${full}`;
  }
  const key =
    process.env.INTERAKT_API_KEY?.trim() ||
    process.env.INTERACT_API_KEY?.trim() ||
    process.env.INTRAKT_API_KEY?.trim();
  if (!key) return null;
  const looksPreEncoded =
    key.length >= 24 &&
    /^[A-Za-z0-9+/]+=*$/.test(key) &&
    !key.includes(" ");
  if (looksPreEncoded) {
    return `Basic ${key}`;
  }
  return `Basic ${Buffer.from(`${key}:`, "utf8").toString("base64")}`;
}

type InteraktTemplatePayload = {
  countryCode: string;
  phoneNumber: string;
  type: "Template";
  callbackData: string;
  template: {
    name: string;
    languageCode: string;
    bodyValues: string[];
  };
};

async function postInterakt(body: InteraktTemplatePayload): Promise<void> {
  const auth = basicAuthHeader();
  if (!auth) {
    throw new Error(
      "Missing Interakt auth: set INTERAKT_API_KEY or INTERAKT_AUTHORIZATION in .env.local (spelled INTERAKT with E; INTERACT_/INTRAKT_ typos are also read). Save the file and restart npm run dev.",
    );
  }
  const res = await fetch("https://api.interakt.ai/v1/public/message/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: auth,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Interakt ${res.status}: ${t.slice(0, 200)}`);
  }
}

function offerLineFromIds(ids: string[]): string {
  if (ids.length === 0) return "NA";
  const labels = ids.map((id) => {
    const d = BOILER_ROOM_DISCOUNTS.find((x) => x.id === id);
    return d?.label ?? id;
  });
  return labels.join("; ");
}

export type TableTemplateContext = {
  reservationId: string;
  outletDisplayName: string;
  guestName: string;
  guestPhone10: string;
  dateYmd: string;
  time24: string;
  notes: string | null;
  selectedDiscountIds: string[];
  totalGuests: number;
};

/** Slot {{6}} — "-" if empty; trim long free text for WhatsApp template limits. */
function templateNotesField(notes: string | null | undefined): string {
  const t = notes?.trim();
  if (!t) return "-";
  if (t.length > 400) return `${t.slice(0, 397)}…`;
  return t;
}

/**
 * Interakt table template: exactly 9 body values for {{1}}…{{9}} in order:
 * 1 outlet, 2 guest name, 3 phone (10 digits), 4 date short, 5 time 12h,
 * 6 notes or "-", 7 offers line or "NA", 8 guest count string, 9 "CONFIRMED".
 */
function tableTemplateBodyValues(ctx: TableTemplateContext): string[] {
  const v = [
    ctx.outletDisplayName,
    ctx.guestName,
    ctx.guestPhone10,
    formatBookingDateShort(ctx.dateYmd),
    formatTime12h(ctx.time24),
    templateNotesField(ctx.notes),
    offerLineFromIds(ctx.selectedDiscountIds),
    String(ctx.totalGuests),
    "CONFIRMED",
  ];
  if (v.length !== 9) throw new Error("Interakt table template expects 9 body values");
  return v.map((x) => (x == null ? "" : String(x)));
}

/** Guest table template — nine body values in fixed order. */
export async function sendInteraktGuestTableBooking(
  ctx: TableTemplateContext,
): Promise<void> {
  const name =
    process.env.INTERAKT_BOOKING_TEMPLATE_NAME?.trim() || "bassik_website";
  const lang =
    process.env.INTERAKT_BOOKING_TEMPLATE_LANGUAGE_CODE?.trim() || "en";
  const bodyValues = tableTemplateBodyValues(ctx);
  await postInterakt({
    countryCode: "+91",
    phoneNumber: ctx.guestPhone10,
    type: "Template",
    callbackData: ctx.reservationId,
    template: { name, languageCode: lang, bodyValues },
  });
}

/** Optional staff copy — same nine values; phone from env. */
export async function sendInteraktStaffTableBooking(
  ctx: TableTemplateContext,
): Promise<void> {
  const staffPhone = process.env.INTERAKT_STAFF_NOTIFY_PHONE?.trim();
  if (!staffPhone) return;
  const digits = staffPhone.replace(/\D/g, "");
  if (!digits || digits === ctx.guestPhone10) return;
  const name =
    process.env.INTERAKT_STAFF_BOOKING_TEMPLATE_NAME?.trim() ||
    "bassik_website_outlet";
  const lang =
    process.env.INTERAKT_STAFF_BOOKING_TEMPLATE_LANGUAGE_CODE?.trim() ||
    process.env.INTERAKT_BOOKING_TEMPLATE_LANGUAGE_CODE?.trim() ||
    "en";
  const bodyValues = tableTemplateBodyValues(ctx);
  let phone10 = digits;
  if (phone10.length === 12 && phone10.startsWith("91"))
    phone10 = phone10.slice(2);
  await postInterakt({
    countryCode: "+91",
    phoneNumber: phone10,
    type: "Template",
    callbackData: ctx.reservationId,
    template: { name, languageCode: lang, bodyValues },
  });
}
