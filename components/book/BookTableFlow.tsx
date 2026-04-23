"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BadgePercent,
  CalendarCheck2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  Minus,
  Moon,
  PartyPopper,
  Phone,
  Plus,
  Sun,
  UserRound,
  Users,
} from "lucide-react";
import { formatTime12h } from "@/lib/booking-format";
import {
  dinnerSlotLabels,
  isSlotInPastToday,
  isYmdTodayLocal,
  lunchSlotLabels,
  nextDayKeys,
  shortDayLabel,
} from "@/lib/booking-slots";
import { digitsOnly } from "@/lib/phone-in";
import { cn } from "@/lib/utils";

type Discount = { id: string; label: string };

function BpSection({
  icon: Icon,
  label,
  hint,
  children,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[color:var(--bp-line)] pb-3.5 pt-0.5 last:border-b-0">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <Icon
            className="size-3.5 shrink-0 text-[var(--bp-accent)] opacity-[0.85]"
            strokeWidth={1.5}
            aria-hidden
          />
          <h2 className="text-[11px] font-medium tracking-wide text-[var(--bp-muted)]">
            {label}
          </h2>
        </div>
        {hint ? (
          <p className="max-w-[58%] text-right text-[10px] leading-tight text-[var(--bp-muted)]/90">
            {hint}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function BookTableFlow() {
  const reduceMotion = useReducedMotion() ?? false;
  const days = useMemo(() => nextDayKeys(15), []);
  const [ymd, setYmd] = useState<string>(() => days[0] ?? "");
  const [session, setSession] = useState<"lunch" | "dinner">("lunch");
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [guests, setGuests] = useState(2);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const lunchSlots = useMemo(() => lunchSlotLabels(), []);
  const dinnerSlots = useMemo(() => dinnerSlotLabels(), []);
  const slotList = session === "lunch" ? lunchSlots : dinnerSlots;

  const pickDay = (d: string) => {
    setYmd(d);
    setTimeSlot(null);
    setSelectedDiscounts([]);
    setDiscounts([]);
  };

  const pickSession = (s: "lunch" | "dinner") => {
    setSession(s);
    setTimeSlot(null);
    setSelectedDiscounts([]);
    setDiscounts([]);
  };

  useEffect(() => {
    if (!ymd || !timeSlot) {
      queueMicrotask(() => {
        setDiscounts([]);
        setSelectedDiscounts([]);
      });
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingOffers(true);
      setError(null);
      try {
        const u = new URL(
          "/api/venues/boiler-room/discounts-available",
          window.location.origin,
        );
        u.searchParams.set("date", ymd);
        u.searchParams.set("timeSlot", timeSlot);
        u.searchParams.set("session", session);
        const r = await fetch(u.toString());
        const j = (await r.json()) as { discounts?: Discount[]; error?: string };
        if (!r.ok) throw new Error(j.error ?? "Could not load offers");
        if (cancelled) return;
        setDiscounts(j.discounts ?? []);
        setSelectedDiscounts((prev) =>
          prev.filter((id) => (j.discounts ?? []).some((d) => d.id === id)),
        );
      } catch (e) {
        if (!cancelled) {
          setDiscounts([]);
          setError(e instanceof Error ? e.message : "Offers error");
        }
      } finally {
        if (!cancelled) setLoadingOffers(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ymd, timeSlot, session]);

  const phoneDigits = digitsOnly(phone);
  const phoneOk = phoneDigits.length === 10;
  const slotLabel = timeSlot ? formatTime12h(timeSlot) : null;
  const canSubmit =
    Boolean(ymd) &&
    Boolean(timeSlot) &&
    fullName.trim().length > 0 &&
    phoneOk &&
    guests >= 1 &&
    guests <= 20;

  const toggleDiscount = (id: string) => {
    setSelectedDiscounts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const submit = async () => {
    if (!canSubmit || !timeSlot) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          contactNumber: phoneDigits,
          numberOfMen: String(guests),
          numberOfWomen: "0",
          numberOfCouples: "0",
          date: ymd,
          timeSlot,
          session,
          notes: null,
          selectedDiscounts,
          brandId: "boiler-room",
          brandName: "Boiler Room",
          hubSpotId: null,
        }),
      });
      const raw = await res.text();
      let j: { reservationId?: string; error?: string } = {};
      if (raw.trim()) {
        try {
          j = JSON.parse(raw) as { reservationId?: string; error?: string };
        } catch {
          throw new Error(
            res.status >= 500
              ? `Server error (${res.status}). If booking keeps failing, run: npm run db:push`
              : `Unexpected response (${res.status}): ${raw.slice(0, 160)}`,
          );
        }
      } else if (!res.ok) {
        throw new Error(`Empty response (${res.status})`);
      }
      if (!res.ok) throw new Error(j.error ?? "Booking failed");
      setSuccessId(j.reservationId ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (successId) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="success"
          className="relative mx-auto w-full max-w-[min(100%,22rem)] px-4 pb-24 pt-8 text-center"
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          <motion.div
            className="mx-auto flex size-12 items-center justify-center rounded-full text-[var(--bp-success)]"
            style={{
              background: "rgba(142, 184, 168, 0.12)",
              boxShadow: "inset 0 0 0 1px rgba(142, 184, 168, 0.25)",
            }}
            initial={reduceMotion ? false : { scale: 0.5, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            <CheckCircle2 className="size-6" strokeWidth={1.5} aria-hidden />
          </motion.div>
          <div className="mt-6 flex items-center justify-center gap-2">
            <PartyPopper className="size-5 text-[var(--bp-accent)]" strokeWidth={1.75} aria-hidden />
            <p
              className="text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-[var(--bp-text)]"
              style={{ fontFamily: "var(--font-book-serif), ui-serif, Georgia, serif" }}
            >
              Table reserved
            </p>
          </div>
          <p className="mx-auto mt-2 max-w-[17rem] text-[12px] font-normal leading-relaxed text-[var(--bp-muted)]">
            We&apos;ve messaged you on WhatsApp. Reference:
          </p>
          <p className="mt-3 inline-block rounded-md border border-[color:var(--bp-line-strong)] bg-[var(--bp-surface)] px-2.5 py-1 font-mono text-[11px] text-[var(--bp-accent-bright)]">
            {successId}
          </p>
          <motion.div
            className="mt-9 flex justify-center"
            whileHover={reduceMotion ? undefined : { scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          >
            <Link
              href="/"
              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[color:var(--bp-line-strong)] bg-[var(--bp-surface)] px-6 text-[11px] font-medium text-[var(--bp-text)] transition hover:border-[var(--bp-accent)]/35 hover:bg-[var(--bp-surface-mid)]"
            >
              Back to home
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      className="relative z-10 mx-auto w-full max-w-[min(100%,22rem)] px-4 pb-28 pt-3"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="mb-5">
        <h1
          className="text-[1.45rem] font-medium leading-[1.15] tracking-[-0.03em] text-[var(--bp-text)] sm:text-[1.55rem]"
          style={{ fontFamily: "var(--font-book-serif), ui-serif, Georgia, serif" }}
        >
          Book a table
        </h1>
        <p className="mt-1.5 max-w-[19rem] text-[12px] font-normal leading-relaxed text-[var(--bp-muted)]">
          Choose a date, sitting, and time — we&apos;ll confirm on WhatsApp.
        </p>
        <motion.div
          layout
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--bp-line-strong)] bg-[var(--bp-surface)] px-2.5 py-1 text-[10px] text-[var(--bp-text)]"
        >
          <span className="relative flex size-1.5">
            <span className="br-ping-off absolute inset-0 animate-ping rounded-full bg-[var(--bp-accent)] opacity-40" />
            <span className="relative size-1.5 rounded-full bg-[var(--bp-accent)] shadow-[0_0_10px_var(--bp-accent)]" />
          </span>
          {slotLabel
            ? `${shortDayLabel(ymd)} · ${slotLabel} · ${guests} guests`
            : "Pick your perfect slot — mix the night your way"}
        </motion.div>
      </header>

      {error ? (
        <div
          className="mb-4 flex gap-2 rounded-md border border-[color:var(--bp-warn-line)] bg-[var(--bp-warn-bg)] px-2.5 py-2 text-left text-[11px] leading-snug text-[var(--bp-warn-text)]"
          role="alert"
        >
          <AlertTriangle
            className="mt-px size-3.5 shrink-0 opacity-90"
            strokeWidth={1.75}
            aria-hidden
          />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="flex flex-col gap-0">
        <BpSection icon={CalendarDays} label="Date" hint="Next 14 days · swipe">
          <div className="shelf-scroll-hide -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 pt-0.5 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
            {days.map((d) => {
              const selected = d === ymd;
              const today = isYmdTodayLocal(d);
              return (
                <motion.button
                  key={d}
                  type="button"
                  onClick={() => pickDay(d)}
                  aria-label={`Book for ${shortDayLabel(d)}`}
                  aria-current={selected ? "date" : undefined}
                  whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                  whileHover={reduceMotion ? undefined : { y: -1 }}
                  className={cn(
                    "snap-start shrink-0 rounded-full border px-2.5 py-1.5 text-left transition",
                    "min-w-[4.25rem] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--bp-accent)]/50",
                    selected
                      ? "border-[color:var(--bp-accent)]/65 bg-[var(--bp-accent-subtle)] text-[var(--bp-text)] shadow-[0_0_0_1px_rgba(191,208,255,0.2),0_8px_20px_-14px_rgba(191,208,255,0.65)]"
                      : "border-transparent bg-[var(--bp-surface)] text-[var(--bp-muted)] hover:bg-[var(--bp-surface-mid)] hover:text-[var(--bp-text)]",
                  )}
                >
                  {today ? (
                    <span className="mb-0.5 block text-[8px] font-semibold uppercase tracking-wider text-[var(--bp-accent)]">
                      Today
                    </span>
                  ) : (
                    <span className="mb-0.5 block h-3" aria-hidden />
                  )}
                  <span className="block text-[12px] font-medium leading-none tracking-tight text-[var(--bp-text)]">
                    {shortDayLabel(d)}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </BpSection>

        <BpSection
          icon={session === "lunch" ? Sun : Moon}
          label="Sitting"
          hint={session === "lunch" ? "Day menu" : "Evening"}
        >
          <div className="flex rounded-full bg-[var(--bp-surface)] p-0.5">
            {(["lunch", "dinner"] as const).map((s) => {
              const active = session === s;
              const Icon = s === "lunch" ? Sun : Moon;
              return (
                <motion.button
                  key={s}
                  type="button"
                  onClick={() => pickSession(s)}
                  layout
                  whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1 rounded-full py-1.5 text-[11px] font-medium capitalize transition",
                    active
                      ? "bg-[var(--bp-accent-bright)] text-[var(--bp-on-accent)] shadow-[0_0_0_1px_rgba(255,255,255,0.35),0_8px_20px_-14px_rgba(191,208,255,0.8)]"
                      : "text-[var(--bp-muted)] hover:text-[var(--bp-text)]",
                  )}
                >
                  <Icon className="size-3" strokeWidth={1.75} aria-hidden />
                  {s}
                </motion.button>
              );
            })}
          </div>
        </BpSection>

        <BpSection
          icon={Clock}
          label="Time"
          hint={
            session === "lunch" ? "12:00–6:00 PM" : "6:15–11:45 PM"
          }
        >
          <motion.div
            key={session}
            className="grid grid-cols-4 gap-1 sm:grid-cols-5"
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {slotList.map((slot) => {
              const past = isSlotInPastToday(ymd, slot);
              const active = timeSlot === slot;
              const label = formatTime12h(slot);
              return (
                <motion.button
                  key={slot}
                  type="button"
                  disabled={past}
                  onClick={() => {
                    if (past) return;
                    setTimeSlot(slot);
                    setSelectedDiscounts([]);
                  }}
                  whileTap={past || reduceMotion ? undefined : { scale: 0.9 }}
                  className={cn(
                    "rounded-full border border-transparent px-0.5 py-1 text-center text-[10px] font-medium leading-tight transition",
                    past && "cursor-not-allowed opacity-25",
                    active
                      ? "border-[color:var(--bp-accent)]/60 bg-[var(--bp-accent-subtle)] text-[var(--bp-text)] shadow-[0_0_0_1px_rgba(191,208,255,0.2)]"
                      : "bg-[var(--bp-surface)] text-[var(--bp-muted)] hover:bg-[var(--bp-surface-mid)] hover:text-[var(--bp-text)]",
                  )}
                >
                  {label}
                </motion.button>
              );
            })}
          </motion.div>
        </BpSection>

        {timeSlot ? (
          <BpSection icon={BadgePercent} label="Offers" hint="Optional">
            {loadingOffers ? (
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--bp-muted)]">
                <Loader2
                  className="size-3 shrink-0 animate-spin text-[var(--bp-accent)]"
                  aria-hidden
                />
                Loading…
              </div>
            ) : discounts.length === 0 ? (
              <p className="text-[11px] leading-snug text-[var(--bp-muted)]">
                None for this slot — continue below.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {discounts.map((d) => {
                  const on = selectedDiscounts.includes(d.id);
                  return (
                    <li key={d.id}>
                      <label className="flex cursor-pointer items-start gap-2.5 text-[12px] leading-snug text-[var(--bp-text)]">
                        <span
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition",
                            on
                              ? "border-[var(--bp-accent)] bg-[var(--bp-accent-bright)] text-[var(--bp-on-accent)]"
                              : "border-[color:var(--bp-line-strong)] bg-transparent",
                          )}
                        >
                          {on ? (
                            <Check className="size-2.5" strokeWidth={3} aria-hidden />
                          ) : null}
                        </span>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleDiscount(d.id)}
                          className="sr-only"
                        />
                        <span className="text-pretty">{d.label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </BpSection>
        ) : null}

        <BpSection icon={Users} label="Guests" hint="Party size">
          <div className="flex items-center justify-center gap-8">
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-full text-[var(--bp-muted)] transition hover:bg-[var(--bp-surface)] hover:text-[var(--bp-text)] active:scale-95"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              aria-label="Fewer guests"
            >
              <Minus className="size-4" strokeWidth={1.5} />
            </button>
            <div className="flex flex-col items-center gap-0.5">
              <motion.span
                key={guests}
                initial={reduceMotion ? { scale: 1 } : { scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="text-2xl font-semibold tabular-nums tracking-tight text-[var(--bp-text)]"
              >
                {guests}
              </motion.span>
              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--bp-muted)]">
                guests
              </span>
            </div>
            <button
              type="button"
              className="flex size-8 items-center justify-center rounded-full text-[var(--bp-muted)] transition hover:bg-[var(--bp-surface)] hover:text-[var(--bp-text)] active:scale-95"
              onClick={() => setGuests((g) => Math.min(20, g + 1))}
              aria-label="More guests"
            >
              <Plus className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        </BpSection>

        <BpSection icon={UserRound} label="Contact" hint="WhatsApp">
          <div className="flex flex-col gap-3.5">
            <label className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--bp-muted)]">
                <UserRound className="size-3 opacity-80" aria-hidden />
                Name
              </span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                className="border-b border-[color:var(--bp-line)] bg-transparent py-1.5 text-[13px] text-[var(--bp-text)] placeholder:text-[var(--bp-muted)]/55 focus:border-[color:var(--bp-accent)]/50 focus:outline-none"
                placeholder="Full name"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--bp-muted)]">
                <Phone className="size-3 opacity-80" aria-hidden />
                Mobile
              </span>
              <div className="relative">
                <input
                  value={phone}
                  onChange={(e) =>
                    setPhone(digitsOnly(e.target.value).slice(0, 10))
                  }
                  inputMode="numeric"
                  autoComplete="tel"
                  className={cn(
                    "w-full border-b border-[color:var(--bp-line)] bg-transparent py-1.5 pr-8 font-mono text-[13px] text-[var(--bp-text)] tracking-wide placeholder:text-[var(--bp-muted)]/55 focus:outline-none",
                    phoneOk
                      ? "border-[var(--bp-success)]/50"
                      : "focus:border-[color:var(--bp-accent)]/50",
                  )}
                  placeholder="10-digit number"
                />
                {phoneOk ? (
                  <span className="pointer-events-none absolute right-0 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-[var(--bp-success)]">
                    <CheckCircle2 className="size-3.5" strokeWidth={2} aria-hidden />
                  </span>
                ) : null}
              </div>
            </label>
          </div>
        </BpSection>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 border-t border-[color:var(--bp-line)] bg-[var(--bp-bg)] px-4 py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="pointer-events-auto mx-auto w-full max-w-[min(100%,22rem)]">
          <motion.button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={() => void submit()}
            whileTap={reduceMotion || !canSubmit || submitting ? undefined : { scale: 0.96 }}
            className={cn(
              "flex min-h-9 w-full items-center justify-center gap-1.5 rounded-full text-[12px] font-medium transition",
              canSubmit && !submitting
                ? "bg-[var(--bp-accent-bright)] text-[var(--bp-on-accent)] shadow-[0_0_22px_-10px_rgba(191,208,255,0.95)] hover:brightness-[1.03] active:scale-[0.99]"
                : "cursor-not-allowed bg-[var(--bp-surface)] text-[var(--bp-muted)]",
            )}
          >
            {submitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              <>
                <CalendarCheck2 className="size-3.5" strokeWidth={1.75} aria-hidden />
                Confirm
              </>
            )}
          </motion.button>
          {!canSubmit && !submitting ? (
            <p className="mt-1.5 text-center text-[10px] text-[var(--bp-muted)]">
              Time, name & mobile required
            </p>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
