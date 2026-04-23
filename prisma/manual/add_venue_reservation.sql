-- Venue + Reservation (table booking). Safe to re-run where supported.

CREATE TABLE IF NOT EXISTS "Venue" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Venue_brandId_key" ON "Venue"("brandId");

CREATE TABLE IF NOT EXISTS "Reservation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fullName" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "numberOfMen" INTEGER NOT NULL,
    "numberOfWomen" INTEGER NOT NULL DEFAULT 0,
    "numberOfCouples" INTEGER NOT NULL DEFAULT 0,
    "date" TEXT NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "notes" TEXT,
    "selectedDiscounts" JSONB NOT NULL,
    "brandId" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "hubSpotId" TEXT,
    "eventId" TEXT,
    "eventName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "dedupeKey" TEXT,
    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Reservation_dedupeKey_createdAt_idx" ON "Reservation"("dedupeKey", "createdAt");
CREATE INDEX IF NOT EXISTS "Reservation_contactNumber_date_timeSlot_createdAt_idx" ON "Reservation"("contactNumber", "date", "timeSlot", "createdAt");
