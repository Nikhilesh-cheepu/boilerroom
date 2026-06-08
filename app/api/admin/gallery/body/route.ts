import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth/admin-server";
import { isBlobConfigured, putBlobRespectingStoreAccess } from "@/lib/blob/hero";
import { addGalleryImageRecord } from "@/lib/gallery-db";

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

function resolveImageContentType(file: File): string | null {
  const direct = file.type || "";
  if (GALLERY_IMAGE_MIME_TYPES.has(direct)) return direct;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  return null;
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

  const contentType = resolveImageContentType(file);
  if (!contentType) {
    return NextResponse.json(
      { error: "Unsupported format. Use JPG, PNG, WebP, or GIF." },
      { status: 400 },
    );
  }

  const alt = String(formData.get("alt") ?? "").trim() || null;
  const pathname = buildGalleryPathname(file.name);

  try {
    const blob = await putBlobRespectingStoreAccess(pathname, file, {
      addRandomSuffix: true,
      contentType,
    });
    await addGalleryImageRecord(blob.url, alt);
    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
