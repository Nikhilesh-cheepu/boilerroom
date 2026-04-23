/** Minutes from midnight for "HH:MM" 24h. */
export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map((x) => parseInt(x, 10));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return -1;
  return h * 60 + m;
}

function minutesToLabel(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

/** Lunch: 12:00 … 18:00 inclusive, every 15 minutes. */
export function lunchSlotLabels(): string[] {
  const out: string[] = [];
  const start = 12 * 60;
  const end = 18 * 60;
  for (let m = start; m <= end; m += 15) {
    out.push(minutesToLabel(m));
  }
  return out;
}

/** Dinner: 18:15 … 23:45 inclusive, every 15 minutes. */
export function dinnerSlotLabels(): string[] {
  const out: string[] = [];
  const start = 18 * 60 + 15;
  const end = 23 * 60 + 45;
  for (let m = start; m <= end; m += 15) {
    out.push(minutesToLabel(m));
  }
  return out;
}

/** YYYY-MM-DD for local calendar date. */
export function formatLocalYmd(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

/** Next `count` days from today (local), each as YYYY-MM-DD. */
export function nextDayKeys(count: number, from = new Date()): string[] {
  const keys: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    keys.push(formatLocalYmd(d));
  }
  return keys;
}

/** Short label for strip: "Wed 23" */
export function shortDayLabel(ymd: string): string {
  const [y, mo, d] = ymd.split("-").map((x) => parseInt(x, 10));
  const dt = new Date(y, mo - 1, d);
  return dt.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function isYmdTodayLocal(ymd: string, now = new Date()): boolean {
  return ymd === formatLocalYmd(now);
}

/** If booking day is today, slots at or before `now` are unavailable (15-min granularity). */
export function isSlotInPastToday(
  ymd: string,
  slot: string,
  now = new Date(),
): boolean {
  if (!isYmdTodayLocal(ymd, now)) return false;
  const slotM = timeToMinutes(slot);
  const cur =
    now.getHours() * 60 + now.getMinutes() + (now.getSeconds() > 0 ? 1 : 0);
  return slotM < cur;
}

export function slotAllowedForSession(
  session: "lunch" | "dinner",
  slot: string,
): boolean {
  const m = timeToMinutes(slot);
  if (m < 0) return false;
  if (session === "lunch") {
    return m >= 12 * 60 && m <= 18 * 60;
  }
  return m >= 18 * 60 + 15 && m <= 23 * 60 + 45;
}
