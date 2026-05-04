import type { VenueOffer, VenueOffersResult } from "./types";

function stripTrailingSlashes(s: string) {
  return s.replace(/\/+$/, "");
}

function asString(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "string") return v;
  return null;
}

function parseOffer(raw: unknown): VenueOffer | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = o.id;
  if (typeof id !== "string" || !id.trim()) return null;

  const badgeRaw =
    o.badgeText ?? o.promoBadge ?? o.stickyLine ?? o.discountLabel ?? o.promoLine;
  return {
    id: id.trim(),
    imageUrl: asString(o.imageUrl),
    title: asString(o.title),
    description: asString(o.description),
    eventDate: asString(o.eventDate),
    entryLabel: asString(o.entryLabel),
    capacityText: asString(o.capacityText),
    endDate: asString(o.endDate),
    badgeText: asString(badgeRaw),
  };
}

/** Accepts `{ offers }` or `{ venue: { offers } }`. */
export function normalizeOffersJson(json: unknown): VenueOffer[] {
  if (!json || typeof json !== "object") return [];
  const root = json as Record<string, unknown>;

  let rawList: unknown[] = [];
  if (Array.isArray(root.offers)) {
    rawList = root.offers;
  } else if (root.venue && typeof root.venue === "object") {
    const v = root.venue as Record<string, unknown>;
    if (Array.isArray(v.offers)) rawList = v.offers;
  }

  const out: VenueOffer[] = [];
  for (const item of rawList) {
    const parsed = parseOffer(item);
    if (parsed) out.push(parsed);
  }
  return out;
}

export async function fetchVenueOffers(): Promise<VenueOffersResult> {
  const baseRaw =
    process.env.EVENTS_API_BASE_URL?.trim() ??
    process.env.BASSIK_EVENTS_API_BASE_URL?.trim();
  if (!baseRaw) {
    return { offers: [], state: "no-base" };
  }

  const base = stripTrailingSlashes(baseRaw);
  const timeoutMs = Math.max(
    0,
    Number(process.env.EVENTS_API_FETCH_TIMEOUT_MS) || 4000,
  );

  const url = `${base}/api/venues/boiler-room`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return { offers: [], state: "fetch-error" };
    }

    const json: unknown = await res.json();
    const offers = normalizeOffersJson(json);
    return {
      offers,
      state: offers.length > 0 ? "ok" : "empty",
    };
  } catch {
    return { offers: [], state: "fetch-error" };
  } finally {
    clearTimeout(timeoutId);
  }
}
