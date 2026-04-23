import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdminSession } from "@/lib/auth/admin-server";
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
      onBeforeGenerateToken: async () => {
        if (!(await isAdminSession())) {
          throw new Error("Not signed in.");
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
        const prev = await prisma.siteSettings.findUnique({ where: { id: 1 } });
        if (prev?.heroVideoPath && prev.heroVideoPath !== blob.url) {
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
            heroVideoPath: blob.url,
          },
          update: { heroVideoPath: blob.url },
        });
        revalidatePath("/");
        revalidatePath("/admin/settings");
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
