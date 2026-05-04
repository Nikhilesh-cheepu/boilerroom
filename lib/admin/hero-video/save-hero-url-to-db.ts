import { revalidatePath } from "next/cache";
import { deleteBlobUrlIfApplicable } from "@/lib/blob/hero";
import { prisma } from "@/lib/prisma";

/** Persist hero Blob URL on SiteSettings and drop previous Blob object if applicable. */
export async function saveHeroVideoUrlToDb(url: string): Promise<void> {
  const prev = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (prev?.heroVideoPath && prev.heroVideoPath !== url) {
    await deleteBlobUrlIfApplicable(prev.heroVideoPath);
  }
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      tagline: prev?.tagline ?? "Sound system loud. Kitchen open late.",
      heroSub:
        prev?.heroSub ??
        "Tonight’s lineup, residents, food & bottle list — scroll like a setlist.",
      heroVideoPath: url,
    },
    update: { heroVideoPath: url },
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/hero");
}
