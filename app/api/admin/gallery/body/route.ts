import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth/admin-server";
import { isBlobConfigured, putBlobRespectingStoreAccess } from "@/lib/blob/hero";

export const runtime = "nodejs";
export const maxDuration = 120;

const GALLERY_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

/** Stay under Vercel's ~4.5MB serverless request body limit. */
const MAX_GALLERY_IMAGE_BYTES = 4 * 1024 * 1024;

function buildGalleryPathname(filename: string): string {
  const safe = filename.replace(/\s+/g, "-").toLowerCase();
  return `gallery/${Date.now()}-${safe}`;
}

/**
 * Same-origin upload — avoids CORS when the browser cannot PUT directly to vercel.com/api/blob
 * (custom domains, localhost).
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

  if (file.size <= 0 || file.size > MAX_GALLERY_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Invalid file size (max 4MB after compression)." },
      { status: 400 },
    );
  }

  const contentType = file.type || "application/octet-stream";
  if (!GALLERY_IMAGE_MIME_TYPES.has(contentType)) {
    return NextResponse.json(
      { error: "Unsupported format. Use JPG, PNG, WebP, or GIF." },
      { status: 400 },
    );
  }

  const pathname = buildGalleryPathname(file.name);

  try {
    const blob = await putBlobRespectingStoreAccess(pathname, file, {
      addRandomSuffix: true,
      contentType: contentType || undefined,
    });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
