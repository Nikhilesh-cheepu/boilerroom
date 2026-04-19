import { PrismaClient } from "@prisma/client";
import {
  drinksMenu,
  faqItems,
  featuredEvents,
  foodMenu,
  residents,
  siteCopy,
  weeklyRhythm,
} from "../lib/content/site";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      tagline: siteCopy.tagline,
      heroSub: siteCopy.heroSub,
      heroVideoPath: null,
    },
    update: {
      tagline: siteCopy.tagline,
      heroSub: siteCopy.heroSub,
    },
  });

  const eventCount = await prisma.event.count();
  if (eventCount === 0) {
    await prisma.event.createMany({
      data: featuredEvents.map((e, i) => ({
        id: e.id,
        sortOrder: i,
        title: e.title,
        dateLabel: e.dateLabel,
        room: e.room,
        genre: e.genre,
        gradient: e.gradient,
      })),
    });
  }

  const resCount = await prisma.resident.count();
  if (resCount === 0) {
    await prisma.resident.createMany({
      data: residents.map((r, i) => ({
        id: r.id,
        sortOrder: i,
        name: r.name,
        tags: JSON.stringify(r.tags),
        gradient: r.gradient,
      })),
    });
  }

  const catCount = await prisma.menuCategory.count();
  if (catCount === 0) {
    let order = 0;
    for (const cat of foodMenu) {
      const created = await prisma.menuCategory.create({
        data: {
          sortOrder: order++,
          label: cat.label,
          kind: "food",
          items: {
            create: cat.items.map((it, j) => ({
              sortOrder: j,
              name: it.name,
              price: it.price,
              note: it.note,
            })),
          },
        },
      });
      // keep id mapping optional — public site uses DB ids
      void created;
    }
    for (const cat of drinksMenu) {
      await prisma.menuCategory.create({
        data: {
          sortOrder: order++,
          label: cat.label,
          kind: "drink",
          items: {
            create: cat.items.map((it, j) => ({
              sortOrder: j,
              name: it.name,
              price: it.price,
              note: it.note,
            })),
          },
        },
      });
    }
  }

  const faqCount = await prisma.faqItem.count();
  if (faqCount === 0) {
    await prisma.faqItem.createMany({
      data: faqItems.map((f, i) => ({
        id: f.id,
        sortOrder: i,
        q: f.q,
        a: f.a,
      })),
    });
  }

  const wCount = await prisma.weeklySlot.count();
  if (wCount === 0) {
    await prisma.weeklySlot.createMany({
      data: weeklyRhythm.map((w, i) => ({
        sortOrder: i,
        day: w.day,
        vibe: w.vibe,
        time: w.time,
      })),
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
