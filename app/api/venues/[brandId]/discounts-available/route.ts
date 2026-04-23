import { NextResponse } from "next/server";
import { slotAllowedForSession } from "@/lib/booking-slots";
import { discountsAvailableForSlot } from "@/lib/reservation-discounts";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ brandId: string }> },
) {
  const { brandId } = await ctx.params;
  const url = new URL(_req.url);
  const date = url.searchParams.get("date")?.trim() ?? "";
  const timeSlot = url.searchParams.get("timeSlot")?.trim() ?? "";
  const session = url.searchParams.get("session")?.trim().toLowerCase() ?? "";

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid or missing date" }, { status: 400 });
  }
  if (!timeSlot || !/^\d{2}:\d{2}$/.test(timeSlot)) {
    return NextResponse.json(
      { error: "Invalid or missing timeSlot" },
      { status: 400 },
    );
  }
  if (session !== "lunch" && session !== "dinner") {
    return NextResponse.json(
      { error: "session must be lunch or dinner" },
      { status: 400 },
    );
  }
  if (!slotAllowedForSession(session, timeSlot)) {
    return NextResponse.json({ discounts: [] });
  }

  const list = discountsAvailableForSlot(brandId, date, timeSlot, session);
  return NextResponse.json({ discounts: list });
}
