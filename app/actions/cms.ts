"use server";

import { unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { deleteBlobUrlIfApplicable } from "@/lib/blob/hero";
import { isAdminSession } from "@/lib/auth/admin-server";
import { addGalleryImageRecord, ensureGalleryTable } from "@/lib/gallery-db";
import { normalizeIndianPhoneDigits } from "@/lib/phone-in";
import { prisma } from "@/lib/prisma";

async function guard() {
  if (!(await isAdminSession())) {
    throw new Error("Unauthorized");
  }
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "hero");

export async function updateSiteCopyAction(formData: FormData): Promise<void> {
  await guard();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const heroSub = String(formData.get("heroSub") ?? "").trim();
  if (!tagline || !heroSub) return;
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, tagline, heroSub },
    update: { tagline, heroSub },
  });
  revalidatePath("/");
}

function emptyToNull(v: string): string | null {
  const t = v.trim();
  return t === "" ? null : t;
}

function phoneFromForm(formData: FormData, key: string): string | null {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return null;
  const n = normalizeIndianPhoneDigits(raw);
  return n === "" ? null : n;
}

export async function updateSiteContactAction(formData: FormData): Promise<void> {
  await guard();
  const prev = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const patch = {
    contactPhoneE164: phoneFromForm(formData, "contactPhoneE164"),
    contactWhatsappE164: phoneFromForm(formData, "contactWhatsappE164"),
    contactPhoneDisplay: emptyToNull(
      String(formData.get("contactPhoneDisplay") ?? ""),
    ),
    contactWhatsappDisplay: emptyToNull(
      String(formData.get("contactWhatsappDisplay") ?? ""),
    ),
    contactInstagramUrl: emptyToNull(
      String(formData.get("contactInstagramUrl") ?? ""),
    ),
    contactMapsUrl: emptyToNull(String(formData.get("contactMapsUrl") ?? "")),
    contactAddressLine: emptyToNull(
      String(formData.get("contactAddressLine") ?? ""),
    ),
    contactBookingMessage: emptyToNull(
      String(formData.get("contactBookingMessage") ?? ""),
    ),
  };

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      tagline:
        prev?.tagline ?? "Sound system loud. Kitchen open late.",
      heroSub:
        prev?.heroSub ??
        "Tonight’s lineup, residents, food & bottle list — scroll like a setlist.",
      ...patch,
    },
    update: patch,
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/contact");
}

/* Hero video: client token POST + `put()` + PATCH — see /api/admin/hero-video */

export async function clearHeroVideoAction(): Promise<void> {
  await guard();
  const prev = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (prev?.heroVideoPath) {
    await deleteBlobUrlIfApplicable(prev.heroVideoPath);
    if (prev.heroVideoPath.startsWith("/uploads/hero/")) {
      const oldName = prev.heroVideoPath.replace("/uploads/hero/", "");
      try {
        await unlink(path.join(UPLOAD_DIR, oldName));
      } catch {
        /* ignore */
      }
    }
  }
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      tagline: prev?.tagline ?? "Sound system loud. Kitchen open late.",
      heroSub:
        prev?.heroSub ??
        "Tonight’s lineup, residents, food & bottle list — scroll like a setlist.",
      heroVideoPath: null,
    },
    update: { heroVideoPath: null },
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/hero");
}

export async function createEventAction(formData: FormData): Promise<void> {
  await guard();
  const title = String(formData.get("title") ?? "").trim();
  const dateLabel = String(formData.get("dateLabel") ?? "").trim();
  const room = String(formData.get("room") ?? "").trim();
  const genre = String(formData.get("genre") ?? "").trim();
  const gradient = String(formData.get("gradient") ?? "").trim();
  if (!title || !dateLabel || !room || !genre || !gradient) return;
  const last = await prisma.event.findFirst({ orderBy: { sortOrder: "desc" } });
  await prisma.event.create({
    data: {
      sortOrder: (last?.sortOrder ?? 0) + 1,
      title,
      dateLabel,
      room,
      genre,
      gradient,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.event.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/events");
}

export async function createResidentAction(formData: FormData): Promise<void> {
  await guard();
  const name = String(formData.get("name") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const gradient = String(formData.get("gradient") ?? "").trim();
  if (!name || !gradient) return;
  const tags = tagsRaw
    ? JSON.stringify(
        tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
      )
    : "[]";
  const last = await prisma.resident.findFirst({
    orderBy: { sortOrder: "desc" },
  });
  await prisma.resident.create({
    data: {
      sortOrder: (last?.sortOrder ?? 0) + 1,
      name,
      tags,
      gradient,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteResidentAction(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.resident.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createFaqAction(formData: FormData): Promise<void> {
  await guard();
  const q = String(formData.get("q") ?? "").trim();
  const a = String(formData.get("a") ?? "").trim();
  if (!q || !a) return;
  const last = await prisma.faqItem.findFirst({ orderBy: { sortOrder: "desc" } });
  await prisma.faqItem.create({
    data: { sortOrder: (last?.sortOrder ?? 0) + 1, q, a },
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteFaqAction(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.faqItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createWeeklyAction(formData: FormData): Promise<void> {
  await guard();
  const day = String(formData.get("day") ?? "").trim();
  const vibe = String(formData.get("vibe") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  if (!day || !vibe || !time) return;
  const last = await prisma.weeklySlot.findFirst({
    orderBy: { sortOrder: "desc" },
  });
  await prisma.weeklySlot.create({
    data: { sortOrder: (last?.sortOrder ?? 0) + 1, day, vibe, time },
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteWeeklyAction(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.weeklySlot.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createMenuCategoryAction(formData: FormData): Promise<void> {
  await guard();
  const label = String(formData.get("label") ?? "").trim();
  const kind = String(formData.get("kind") ?? "") as "food" | "drink";
  if (!label || (kind !== "food" && kind !== "drink")) return;
  const last = await prisma.menuCategory.findFirst({
    orderBy: { sortOrder: "desc" },
  });
  await prisma.menuCategory.create({
    data: { sortOrder: (last?.sortOrder ?? 0) + 1, label, kind },
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createMenuItemAction(formData: FormData): Promise<void> {
  await guard();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  if (!categoryId || !name || !price) return;
  const last = await prisma.menuItem.findFirst({
    where: { categoryId },
    orderBy: { sortOrder: "desc" },
  });
  await prisma.menuItem.create({
    data: {
      categoryId,
      sortOrder: (last?.sortOrder ?? 0) + 1,
      name,
      price,
      note: note || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteMenuItemAction(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteMenuCategoryAction(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.menuCategory.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addGalleryImageFromUpload(
  url: string,
  alt?: string,
): Promise<void> {
  await guard();
  await addGalleryImageRecord(url, alt);
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryImage(formData: FormData): Promise<void> {
  await guard();
  await ensureGalleryTable();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryImages(formData: FormData): Promise<void> {
  await guard();
  await ensureGalleryTable();
  const ids = formData
    .getAll("ids")
    .map((v) => String(v).trim())
    .filter(Boolean);
  if (ids.length === 0) return;
  await prisma.galleryImage.deleteMany({ where: { id: { in: ids } } });
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function moveGalleryImage(formData: FormData): Promise<void> {
  await guard();
  await ensureGalleryTable();
  const id = String(formData.get("id") ?? "").trim();
  const direction = String(formData.get("direction") ?? "").trim();
  if (!id || (direction !== "up" && direction !== "down")) return;

  const list = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const currentIndex = list.findIndex((item) => item.id === id);
  if (currentIndex < 0) return;
  const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (swapIndex < 0 || swapIndex >= list.length) return;

  const current = list[currentIndex];
  const target = list[swapIndex];
  await prisma.$transaction([
    prisma.galleryImage.update({
      where: { id: current.id },
      data: { sortOrder: target.sortOrder },
    }),
    prisma.galleryImage.update({
      where: { id: target.id },
      data: { sortOrder: current.sortOrder },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}
