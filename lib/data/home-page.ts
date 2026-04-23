import { prisma } from "@/lib/prisma";
import type { MenuCategory } from "@/lib/content/site";
import {
  resolveSiteContact,
  type ResolvedSiteContact,
} from "@/lib/site-contact";

export type HomeMenus = {
  food: MenuCategory[];
  beverage: MenuCategory[];
  happyhours: MenuCategory[];
};

export type HomePageData = {
  heroVideoPath: string | null;
  menus: HomeMenus;
  contact: ResolvedSiteContact;
};

function resolveHeroVideoSrc(path: string | null): string | null {
  if (!path) return null;
  if (!path.startsWith("http")) return path;
  // Proxy Vercel Blob URLs through our API so private stores still render on homepage.
  if (path.includes("blob.vercel-storage.com")) {
    return `/api/hero-video?src=${encodeURIComponent(path)}`;
  }
  return path;
}

function mapCategory(c: {
  id: string;
  label: string;
  items: { id: string; name: string; price: string; note: string | null }[];
}): MenuCategory {
  return {
    id: c.id,
    label: c.label,
    items: c.items.map((it) => ({
      id: it.id,
      name: it.name,
      price: it.price,
      note: it.note ?? undefined,
    })),
  };
}

export async function getHomePageData(): Promise<HomePageData> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  const food = categories
    .filter((c) => c.kind === "food")
    .map(mapCategory);
  const beverage = categories
    .filter((c) => c.kind === "beverage" || c.kind === "drink")
    .map(mapCategory);
  const happyhours = categories
    .filter((c) => c.kind === "happyhours")
    .map(mapCategory);

  return {
    heroVideoPath: resolveHeroVideoSrc(settings?.heroVideoPath ?? null),
    menus: { food, beverage, happyhours },
    contact: resolveSiteContact(settings ?? undefined),
  };
}
