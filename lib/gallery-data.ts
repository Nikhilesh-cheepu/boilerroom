import { prisma } from "@/lib/prisma";

export type GalleryImageDTO = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
};

export async function getGalleryPreview(limit = 14): Promise<GalleryImageDTO[]> {
  try {
    return await prisma.galleryImage.findMany({
      orderBy: { sortOrder: "asc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getGalleryAll(): Promise<GalleryImageDTO[]> {
  try {
    return await prisma.galleryImage.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}
