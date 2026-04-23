import { digitsOnly, normalizeIndianPhoneDigits } from "@/lib/phone-in";

/** API + Interakt guest line: exactly 10 digits after normalizing +91 / spaces. */
export function tenDigitIndianMobile(raw: string): string | null {
  let d = normalizeIndianPhoneDigits(raw) || digitsOnly(raw);
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 10 && /^\d{10}$/.test(d)) return d;
  return null;
}
