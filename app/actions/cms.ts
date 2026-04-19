"use server";

import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { isAdminSession } from "@/lib/auth/admin-server";
import { prisma } from "@/lib/prisma";

async function guard() {
  if (!(await isAdminSession())) {
    throw new Error("Unauthorized");
  }
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "hero");
const ALLOWED_MIME = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
]);

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

export async function uploadHeroVideoAction(formData: FormData): Promise<void> {
  await guard();
  const file = formData.get("video");
  if (!(file instanceof File) || file.size === 0) return;
  if (file.size > 100 * 1024 * 1024) return;
  const mime = file.type || "application/octet-stream";
  if (!ALLOWED_MIME.has(mime)) return;

  const ext =
    mime === "video/webm"
      ? "webm"
      : mime === "video/quicktime" || mime === "video/x-m4v"
        ? "mov"
        : "mp4";

  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `hero-${Date.now()}.${ext}`;
  const diskPath = path.join(UPLOAD_DIR, name);
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(diskPath, buf);

  const publicPath = `/uploads/hero/${name}`;

  const prev = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (prev?.heroVideoPath?.startsWith("/uploads/hero/")) {
    const oldName = prev.heroVideoPath.replace("/uploads/hero/", "");
    try {
      await unlink(path.join(UPLOAD_DIR, oldName));
    } catch {
      /* ignore */
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
      heroVideoPath: publicPath,
    },
    update: { heroVideoPath: publicPath },
  });

  revalidatePath("/");
}

export async function clearHeroVideoAction(): Promise<void> {
  await guard();
  const prev = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (prev?.heroVideoPath?.startsWith("/uploads/hero/")) {
    const oldName = prev.heroVideoPath.replace("/uploads/hero/", "");
    try {
      await unlink(path.join(UPLOAD_DIR, oldName));
    } catch {
      /* ignore */
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
  revalidatePath("/admin/events");
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.event.delete({ where: { id } });
  revalidatePath("/");
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
  revalidatePath("/admin/djs");
}

export async function deleteResidentAction(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.resident.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/djs");
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
  revalidatePath("/admin/faq");
}

export async function deleteFaqAction(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.faqItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/faq");
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
  revalidatePath("/admin/weekly");
}

export async function deleteWeeklyAction(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.weeklySlot.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/weekly");
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
  revalidatePath("/admin/menu");
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
  revalidatePath("/admin/menu");
}

export async function deleteMenuItemAction(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/menu");
}

export async function deleteMenuCategoryAction(formData: FormData): Promise<void> {
  await guard();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.menuCategory.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/menu");
}
