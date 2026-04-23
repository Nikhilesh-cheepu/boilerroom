import { createHash } from "node:crypto";

export function bookingFingerprint(parts: {
  fullName: string;
  contactNumber: string;
  date: string;
  timeSlot: string;
  numberOfMen: number;
  discounts: string[];
}): string {
  const sorted = [...parts.discounts].sort().join(",");
  const raw = `${parts.fullName.trim().toLowerCase()}|${parts.contactNumber}|${parts.date}|${parts.timeSlot}|${parts.numberOfMen}|${sorted}`;
  return createHash("sha256").update(raw, "utf8").digest("hex");
}
