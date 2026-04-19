import { prisma } from "@/lib/prisma";
import type {
  DJItem,
  EventItem,
  FaqItem,
  MenuCategory,
} from "@/lib/content/site";

export type SiteCopy = {
  tagline: string;
  heroSub: string;
  heroVideoPath: string | null;
};

export type WeeklyRow = { id: string; day: string; vibe: string; time: string };

export type PublicSitePayload = {
  copy: SiteCopy;
  events: EventItem[];
  residents: DJItem[];
  weekly: WeeklyRow[];
  foodMenu: MenuCategory[];
  drinksMenu: MenuCategory[];
  faq: FaqItem[];
};

function parseTags(raw: string): string[] {
  try {
    const j = JSON.parse(raw) as unknown;
    if (Array.isArray(j) && j.every((x) => typeof x === "string")) {
      return j;
    }
  } catch {
    /* fall through */
  }
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function getPublicSiteData(): Promise<PublicSitePayload> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const events = await prisma.event.findMany({ orderBy: { sortOrder: "asc" } });
  const residents = await prisma.resident.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });
  const faq = await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });
  const weekly = await prisma.weeklySlot.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const copy: SiteCopy = settings
    ? {
        tagline: settings.tagline,
        heroSub: settings.heroSub,
        heroVideoPath: settings.heroVideoPath,
      }
    : {
        tagline: "Sound system loud. Kitchen open late.",
        heroSub:
          "Tonight’s lineup, residents, food & bottle list — scroll like a setlist.",
        heroVideoPath: null,
      };

  const mapMenu = (kind: "food" | "drink"): MenuCategory[] =>
    categories
      .filter((c) => c.kind === kind)
      .map((c) => ({
        id: c.id,
        label: c.label,
        items: c.items.map((it) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          note: it.note ?? undefined,
        })),
      }));

  return {
    copy,
    events: events.map((e) => ({
      id: e.id,
      title: e.title,
      dateLabel: e.dateLabel,
      room: e.room,
      genre: e.genre,
      gradient: e.gradient,
    })),
    residents: residents.map((r) => ({
      id: r.id,
      name: r.name,
      tags: parseTags(r.tags),
      gradient: r.gradient,
    })),
    weekly: weekly.map((w) => ({
      id: w.id,
      day: w.day,
      vibe: w.vibe,
      time: w.time,
    })),
    foodMenu: mapMenu("food"),
    drinksMenu: mapMenu("drink"),
    faq: faq.map((f) => ({ id: f.id, q: f.q, a: f.a })),
  };
}
