import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  drinksMenu,
  foodMenu,
  type MenuCategory,
} from "@/lib/content/site";
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

const FALLBACK_MENUS: HomeMenus = {
  food: foodMenu,
  beverage: drinksMenu,
  happyhours: [],
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

/** Deduped per request — hero + dock can resolve without waiting on menus. */
const getSiteSettingsCached = cache(async () =>
  prisma.siteSettings.findUnique({ where: { id: 1 } }),
);

const getMenuCategoriesCached = cache(async () =>
  prisma.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  }),
);

/** Fast path for streaming hero (settings only, parallel with menu query elsewhere). */
export async function getHeroVideoForHome(): Promise<string | null> {
  try {
    const settings = await getSiteSettingsCached();
    return resolveHeroVideoSrc(settings?.heroVideoPath ?? null);
  } catch {
    return null;
  }
}

export async function getSiteContactForHome(): Promise<ResolvedSiteContact> {
  try {
    const settings = await getSiteSettingsCached();
    return resolveSiteContact(settings ?? undefined);
  } catch {
    return resolveSiteContact(undefined);
  }
}

export async function getHomePageData(): Promise<HomePageData> {
  try {
    const [settings, categories] = await Promise.all([
      getSiteSettingsCached(),
      getMenuCategoriesCached(),
    ]);

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
  } catch (e) {
    // Vercel build (or fresh environments) may not have DATABASE_URL at prerender time.
    // Keep the homepage renderable with static fallback content.
    console.warn("[home-page] Falling back to static content:", e);
    return {
      heroVideoPath: null,
      menus: FALLBACK_MENUS,
      contact: resolveSiteContact(undefined),
    };
  }
}
