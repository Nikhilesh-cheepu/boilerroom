import { Prisma } from "@prisma/client";
import { toBlobProxyUrl } from "@/lib/blob/proxy-url";
import { markGalleryTablePresent } from "@/lib/gallery-db";
import { prisma } from "@/lib/prisma";

export type GalleryImageDTO = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
};

function mapGalleryRow(row: GalleryImageDTO): GalleryImageDTO {
  return { ...row, url: toBlobProxyUrl(row.url) };
}

/** Avoid `findMany` when the table is missing (no noisy Prisma errors in logs). */
let galleryTableExists: boolean | null = null;

async function isGalleryTablePresent(): Promise<boolean> {
  if (galleryTableExists !== null) return galleryTableExists;
  try {
    const rows = await prisma.$queryRaw<{ exists: boolean }[]>(
      Prisma.sql`
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_name = 'GalleryImage'
        ) AS "exists"
      `,
    );
    galleryTableExists = Boolean(rows[0]?.exists);
    if (galleryTableExists) markGalleryTablePresent();
    return galleryTableExists;
  } catch {
    galleryTableExists = false;
    return false;
  }
}

export async function getGalleryPreview(limit = 14): Promise<GalleryImageDTO[]> {
  if (!(await isGalleryTablePresent())) return [];
  try {
    const rows = await prisma.galleryImage.findMany({
      orderBy: { sortOrder: "asc" },
      take: limit,
    });
    return rows.map(mapGalleryRow);
  } catch {
    return [];
  }
}

export async function getGalleryAll(): Promise<GalleryImageDTO[]> {
  if (!(await isGalleryTablePresent())) return [];
  try {
    const rows = await prisma.galleryImage.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return rows.map(mapGalleryRow);
  } catch {
    return [];
  }
}
