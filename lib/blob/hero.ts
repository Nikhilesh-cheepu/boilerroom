import { del, put, type PutBlobResult } from "@vercel/blob";
import { isPrivateStorePublicAccessError } from "@/lib/blob/private-store-error";

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

type PutHeroExtras = Pick<
  Parameters<typeof put>[2],
  "addRandomSuffix" | "multipart" | "contentType"
>;

/** Server `put` — public store prefers public blobs; private stores fall back to `private`. */
export async function putBlobRespectingStoreAccess(
  pathname: string,
  file: File,
  extras: PutHeroExtras = {},
): Promise<PutBlobResult> {
  const token = getToken();
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set.");
  }
  const base = { token, ...extras };
  try {
    return await put(pathname, file, { ...base, access: "public" });
  } catch (error) {
    if (!isPrivateStorePublicAccessError(error)) throw error;
    return await put(pathname, file, { ...base, access: "private" });
  }
}

/** Upload hero video to Vercel Blob; returns the Blob URL. */
export async function uploadHeroBlob(file: File): Promise<string> {
  const mime = file.type || "application/octet-stream";
  if (!ALLOWED_MIME.has(mime)) {
    throw new Error("Use MP4, WebM, or MOV.");
  }
  if (file.size > 100 * 1024 * 1024) {
    throw new Error("Max file size is 100MB.");
  }

  const ext = extFromMime(mime);
  const pathname = `boiler-room/hero/${Date.now()}.${ext}`;
  const blob = await putBlobRespectingStoreAccess(pathname, file, {
    contentType: mime,
  });
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
