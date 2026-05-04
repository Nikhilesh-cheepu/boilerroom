import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth/admin-server";
import { buildHeroBlobPathnameForToken } from "@/lib/admin/hero-video/build-hero-blob-pathname";
import {
  HERO_VIDEO_MIME_TYPES,
  MAX_HERO_VIDEO_BYTES,
} from "@/lib/admin/hero-video/constants";
import { saveHeroVideoUrlToDb } from "@/lib/admin/hero-video/save-hero-url-to-db";
import { isBlobConfigured, putBlobRespectingStoreAccess } from "@/lib/blob/hero";

export const runtime = "nodejs";
export const maxDuration = 300;

/**
 * Same-origin upload for local dev (avoids CORS on direct Blob client → vercel.com).
 * Also persists the URL like PATCH /api/admin/hero-video.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: "Set BLOB_READ_WRITE_TOKEN in the server environment." },
      { status: 400 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file field." }, { status: 400 });
  }

  if (file.size <= 0 || file.size > MAX_HERO_VIDEO_BYTES) {
    return NextResponse.json({ error: "Invalid file size (max 100MB)." }, { status: 400 });
  }

  const contentType = file.type || "application/octet-stream";
  if (!HERO_VIDEO_MIME_TYPES.has(contentType)) {
    return NextResponse.json(
      { error: "Unsupported format. Use MP4, WebM, or MOV." },
      { status: 400 },
    );
  }

  const pathname = buildHeroBlobPathnameForToken(file.name);

  try {
    const blob = await putBlobRespectingStoreAccess(pathname, file, {
      addRandomSuffix: true,
      contentType: contentType || undefined,
      multipart: file.size >= 8 * 1024 * 1024,
    });
    await saveHeroVideoUrlToDb(blob.url);
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
