import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

let galleryTableEnsured = false;

/** Create GalleryImage table on first use if migrations were never run on production. */
export async function ensureGalleryTable(): Promise<void> {
  if (galleryTableEnsured) return;
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "GalleryImage" (
      "id" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      "alt" TEXT,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
    );
  `);
  galleryTableEnsured = true;
}

export function markGalleryTablePresent(): void {
  galleryTableEnsured = true;
}

function isMissingGalleryTableError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
    return true;
  }
  const msg = error instanceof Error ? error.message : String(error ?? "");
  return msg.includes("GalleryImage") && msg.includes("does not exist");
}

export async function addGalleryImageRecord(
  url: string,
  alt?: string | null,
): Promise<void> {
  const safeUrl = url.trim();
  if (!safeUrl) throw new Error("Missing image URL.");

  const write = async () => {
    const last = await prisma.galleryImage.findFirst({
      orderBy: { sortOrder: "desc" },
    });
    await prisma.galleryImage.create({
      data: {
        url: safeUrl,
        alt: alt?.trim() || null,
        sortOrder: (last?.sortOrder ?? 0) + 1,
      },
    });
  };

  try {
    await write();
  } catch (error) {
    if (!isMissingGalleryTableError(error)) throw error;
    await ensureGalleryTable();
    await write();
  }
}
