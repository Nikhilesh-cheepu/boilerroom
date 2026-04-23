import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  isSlotInPastToday,
  nextDayKeys,
  slotAllowedForSession,
} from "@/lib/booking-slots";
import { tenDigitIndianMobile } from "@/lib/booking-phone";
import {
  sendInteraktGuestTableBooking,
  sendInteraktStaffTableBooking,
} from "@/lib/interakt-booking";
import { prisma } from "@/lib/prisma";
import { bookingFingerprint } from "@/lib/reservation-fingerprint";
import { isValidDiscountIdForSlot } from "@/lib/reservation-discounts";

const DEDupe_MS = 30_000;

type Body = {
  fullName?: string;
  contactNumber?: string;
  numberOfMen?: string | number;
  numberOfWomen?: string | number;
  numberOfCouples?: string | number;
  date?: string;
  timeSlot?: string;
  session?: string;
  notes?: string | null;
  selectedDiscounts?: string[];
  brandId?: string;
  brandName?: string;
  hubSpotId?: string | null;
  eventId?: string;
  eventName?: string;
};

function parseIntLoose(v: string | number | undefined, def: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  const n = parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : def;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: Request) {
  try {
    return await handleReservationPost(req);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("[reservations]", e);
    return jsonError(msg, 500);
  }
}

async function handleReservationPost(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return jsonError("Invalid JSON", 400);
  }

  const brandId = String(body.brandId ?? "").trim();
  const brandName = String(body.brandName ?? "").trim();
  const fullName = String(body.fullName ?? "").trim();
  const date = String(body.date ?? "").trim();
  const timeSlot = String(body.timeSlot ?? "").trim();
  const sessionRaw = String(body.session ?? "").trim().toLowerCase();
  const notes =
    body.notes === undefined || body.notes === null
      ? null
      : String(body.notes).trim() || null;

  if (brandId !== "boiler-room") {
    return jsonError("Unsupported brandId", 400);
  }
  if (brandName !== "Boiler Room") {
    return jsonError("Invalid brandName", 400);
  }
  if (!fullName) {
    return jsonError("fullName is required", 400);
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return jsonError("Invalid date", 400);
  }
  const allowedDays = new Set(nextDayKeys(15));
  if (!allowedDays.has(date)) {
    return jsonError("Date out of booking window", 400);
  }
  if (!timeSlot || !/^\d{2}:\d{2}$/.test(timeSlot)) {
    return jsonError("Invalid timeSlot", 400);
  }
  if (sessionRaw !== "lunch" && sessionRaw !== "dinner") {
    return jsonError("Invalid session", 400);
  }
  const session = sessionRaw as "lunch" | "dinner";
  if (!slotAllowedForSession(session, timeSlot)) {
    return jsonError("Time does not match session", 400);
  }
  if (isSlotInPastToday(date, timeSlot)) {
    return jsonError("Time is in the past", 400);
  }

  const phone10 = tenDigitIndianMobile(String(body.contactNumber ?? ""));
  if (!phone10) {
    return jsonError("Invalid 10-digit Indian mobile", 400);
  }

  const nMen = parseIntLoose(body.numberOfMen, -1);
  const nWomen = parseIntLoose(body.numberOfWomen, 0);
  const nCouples = parseIntLoose(body.numberOfCouples, 0);
  if (nMen < 1 || nMen > 20) {
    return jsonError("numberOfMen must be 1–20 (total guests)", 400);
  }
  if (nWomen !== 0 || nCouples !== 0) {
    return jsonError("Only numberOfMen is used for guest count in this flow", 400);
  }

  if (body.eventId != null && String(body.eventId).trim() !== "") {
    return jsonError("eventId not supported on this table-only endpoint", 400);
  }

  const selectedDiscounts = Array.isArray(body.selectedDiscounts)
    ? body.selectedDiscounts.map((x) => String(x).trim()).filter(Boolean)
    : [];
  for (const id of selectedDiscounts) {
    if (!isValidDiscountIdForSlot(brandId, date, timeSlot, session, id)) {
      return jsonError(`Invalid or inapplicable discount: ${id}`, 400);
    }
  }

  const fp = bookingFingerprint({
    fullName,
    contactNumber: phone10,
    date,
    timeSlot,
    numberOfMen: nMen,
    discounts: selectedDiscounts,
  });

  if (typeof prisma.reservation?.findFirst !== "function") {
    return jsonError(
      "Database client is missing Reservation. Run: npx prisma generate && npm run db:push, then restart dev.",
      503,
    );
  }

  const since = new Date(Date.now() - DEDupe_MS);
  let dup: { id: string } | null;
  try {
    dup = await prisma.reservation.findFirst({
      where: { dedupeKey: fp, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021") {
      return jsonError(
        "Database is missing the Reservation table. From the project root run: npm run db:push (same .env.local as next dev), then restart npm run dev.",
        503,
      );
    }
    throw e;
  }
  if (dup) {
    return NextResponse.json({
      ok: true,
      reservationId: dup.id,
      deduped: true,
    });
  }

  const skipInterakt =
    process.env.BOOKING_SKIP_INTERAKT === "true" ||
    process.env.BOOKING_SKIP_INTERAKT === "1";

  let row: { id: string };
  try {
    row = await prisma.reservation.create({
      data: {
        fullName,
        contactNumber: phone10,
        numberOfMen: nMen,
        numberOfWomen: 0,
        numberOfCouples: 0,
        date,
        timeSlot,
        session,
        notes,
        selectedDiscounts: selectedDiscounts,
        brandId,
        brandName,
        hubSpotId: body.hubSpotId ? String(body.hubSpotId) : null,
        eventId: null,
        eventName: null,
        status: "confirmed",
        dedupeKey: fp,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Database error";
    if (msg.includes("Cannot read properties of undefined")) {
      return jsonError(
        "Database client is stale. Stop dev, run: npx prisma generate && npm run db:push, then npm run dev again.",
        503,
      );
    }
    return jsonError(
      msg.includes("does not exist") || msg.includes("P2021") || msg.includes("Unknown arg")
        ? "Database tables out of sync. Run: npm run db:push"
        : msg,
      500,
    );
  }

  const ctx = {
    reservationId: row.id,
    outletDisplayName: "Boiler Room",
    guestName: fullName,
    guestPhone10: phone10,
    dateYmd: date,
    time24: timeSlot,
    notes,
    selectedDiscountIds: selectedDiscounts,
    totalGuests: nMen,
  };

  if (!skipInterakt) {
    try {
      await sendInteraktGuestTableBooking(ctx);
    } catch (e) {
      await prisma.reservation.delete({ where: { id: row.id } }).catch(() => {});
      const msg = e instanceof Error ? e.message : "Interakt failed";
      return jsonError(msg, 502);
    }
    try {
      await sendInteraktStaffTableBooking(ctx);
    } catch {
      /* staff optional — log-only per spec */
    }
  }

  return NextResponse.json({
    ok: true,
    reservationId: row.id,
  });
}
