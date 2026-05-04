-- Run once on production if `GalleryImage` is missing (fixes Prisma P2021 + log spam).
-- Example: Railway / Postgres SQL console, or `psql $DATABASE_URL -f prisma/manual/add_gallery_image.sql`

CREATE TABLE IF NOT EXISTS "GalleryImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);
