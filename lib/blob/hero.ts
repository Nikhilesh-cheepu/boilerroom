import { del, put } from "@vercel/blob";

function getToken() {
  const t = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return t || null;
}

export function isBlobConfigured(): boolean {
  return Boolean(getToken());
}

const ALLOWED_MIME = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
]);

function extFromMime(mime: string): string {
  if (mime === "video/webm") return "webm";
  if (mime === "video/quicktime" || mime === "video/x-m4v") return "mov";
  return "mp4";
}

function isPrivateStorePublicAccessError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error ?? "");
  return msg.toLowerCase().includes("cannot use public access on a private store");
}

/** Upload hero video to Vercel Blob; returns the Blob URL. */
export async function uploadHeroBlob(file: File): Promise<string> {
  const token = getToken();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set.");
  }
  const mime = file.type || "application/octet-stream";
  if (!ALLOWED_MIME.has(mime)) {
    throw new Error("Use MP4, WebM, or MOV.");
  }
  if (file.size > 100 * 1024 * 1024) {
    throw new Error("Max file size is 100MB.");
  }

  const ext = extFromMime(mime);
  const pathname = `boiler-room/hero/${Date.now()}.${ext}`;

  // Try public first for best CDN delivery on the homepage.
  // If the store is private, fall back to private access automatically.
  let blob;
  try {
    blob = await put(pathname, file, {
      access: "public",
      token,
      contentType: mime,
    });
  } catch (error) {
    if (!isPrivateStorePublicAccessError(error)) throw error;
    blob = await put(pathname, file, {
      access: "private",
      token,
      contentType: mime,
    });
  }

  return blob.url;
}

/** Remove a file from Blob storage if URL is on Vercel Blob. */
export async function deleteBlobUrlIfApplicable(url: string): Promise<void> {
  const token = getToken();
  if (!token) return;
  if (!url.includes("blob.vercel-storage.com")) return;
  try {
    await del(url, { token });
  } catch {
    /* ignore — may already be deleted */
  }
}
