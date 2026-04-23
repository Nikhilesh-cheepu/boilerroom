-- Run once on your Postgres (e.g. Railway → Query / psql) if `npm run db:push` is not available.
-- Safe to re-run: uses IF NOT EXISTS (PostgreSQL 9.1+).

ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactPhoneE164" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactWhatsappE164" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactPhoneDisplay" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactWhatsappDisplay" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactInstagramUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactMapsUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactAddressLine" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactBookingMessage" TEXT;
