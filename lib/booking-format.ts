/** e.g. 22 Apr 2026 */
export function formatBookingDateShort(ymd: string): string {
  const [y, mo, d] = ymd.split("-").map((x) => parseInt(x, 10));
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d))
    return ymd;
  const dt = new Date(y, mo - 1, d);
  return dt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** 24h "HH:MM" → e.g. 8:00 PM */
export function formatTime12h(time24: string): string {
  const [h0, m0] = time24.split(":").map((x) => parseInt(x, 10));
  if (!Number.isFinite(h0) || !Number.isFinite(m0)) return time24;
  const period = h0 >= 12 ? "PM" : "AM";
  const h12 = h0 % 12 === 0 ? 12 : h0 % 12;
  return `${h12}:${String(m0).padStart(2, "0")} ${period}`;
}
