import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminSession } from "@/lib/auth/admin-server";
import {
  deleteBlobUrlIfApplicable,
  isBlobConfigured,
  uploadHeroBlob,
} from "@/lib/blob/hero";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!isBlobConfigured()) {
    return NextResponse.json(
      {
        error:
          "Set BLOB_READ_WRITE_TOKEN in the server environment (Vercel Blob).",
      },
      { status: 400 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Bad upload body";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const file = formData.get("video");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Choose a video file." },
      { status: 400 },
    );
  }

  let publicUrl: string;
  try {
    publicUrl = await uploadHeroBlob(file);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const prev = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (prev?.heroVideoPath && prev.heroVideoPath !== publicUrl) {
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
      heroVideoPath: publicUrl,
    },
    update: { heroVideoPath: publicUrl },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");

  return NextResponse.json({ ok: true, url: publicUrl });
}
