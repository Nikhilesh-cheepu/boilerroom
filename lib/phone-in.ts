/** Digits only (for phone / WhatsApp fields). */
export function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

/**
 * Indian mobiles: type 10 digits (e.g. 9876543210) and we store/link as 91XXXXXXXXXX.
 * - Strips spaces, dashes, +91, leading 0 from trunk prefixes.
 * - 12 digits already starting with 91 are left as-is.
 * - Other lengths (e.g. US 11-digit) are returned digits-only unchanged.
 */
export function normalizeIndianPhoneDigits(raw: string): string {
  let d = digitsOnly(raw);
  if (!d) return "";
  while (d.startsWith("0") && d.length > 10) d = d.slice(1);
  if (d.length === 10) return `91${d}`;
  return d;
}
