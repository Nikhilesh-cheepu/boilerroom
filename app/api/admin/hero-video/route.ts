import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdminSession } from "@/lib/auth/admin-server";
import { HERO_BLOB_PREFIX } from "@/lib/admin/hero-video/constants";
import {
  deleteBlobUrlIfApplicable,
  isBlobConfigured,
} from "@/lib/blob/hero";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request): Promise<NextResponse> {
  if (!isBlobConfigured()) {
    return NextResponse.json(
      {
        error:
          "Set BLOB_READ_WRITE_TOKEN in the server environment (Vercel Blob).",
      },
      { status: 400 },
    );
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdminSession())) {
          throw new Error("Not signed in.");
        }
        if (!pathname.startsWith(HERO_BLOB_PREFIX)) {
          throw new Error("Invalid upload path.");
        }
        return {
          allowedContentTypes: [
            "video/mp4",
            "video/webm",
            "video/quicktime",
            "video/x-m4v",
          ],
          maximumSizeInBytes: 100 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Keep callback side-effect free to avoid client retries getting stuck at 99%.
        // We persist `blob.url` in PATCH /api/admin/hero-video from the browser after upload succeeds.
        void blob;
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function PATCH(request: Request): Promise<NextResponse> {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  let url = "";
  try {
    const body = (await request.json()) as { url?: string };
    url = String(body.url ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!url || !url.startsWith("http")) {
    return NextResponse.json({ error: "Invalid uploaded URL." }, { status: 400 });
  }

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
  revalidatePath("/admin/settings");
  return NextResponse.json({ ok: true, url });
}
