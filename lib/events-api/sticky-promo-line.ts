import type { VenueOffer, VenueOffersLoadState } from "./types";

const MAX_LEN = 72;

function firstMeaningfulLine(text: string | null): string | null {
  if (!text) return null;
  const line = text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .find(Boolean);
  return line ?? null;
}

function truncate(s: string): string {
  if (s.length <= MAX_LEN) return s;
  return `${s.slice(0, MAX_LEN - 1)}…`;
}

function pushUnique(out: string[], seen: Set<string>, raw: string | null) {
  if (!raw) return;
  const normalized = truncate(raw.replace(/\s+/g, " ").trim());
  if (!normalized) return;
  const key = normalized.toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  out.push(normalized);
}

/**
 * Promo lines for the home sticky promo pill — only from venue offers.
 * Prefers explicit badge fields, then entry line, then description.
 */
export function stickyPromoLinesFromOffers(
  offers: VenueOffer[],
  state: VenueOffersLoadState,
): string[] {
  if (state !== "ok" || offers.length === 0) return [];

  const out: string[] = [];
  const seen = new Set<string>();

  for (const o of offers) {
    pushUnique(out, seen, o.badgeText);
    pushUnique(out, seen, o.entryLabel);
    pushUnique(out, seen, firstMeaningfulLine(o.description));
  }

  return out;
}
