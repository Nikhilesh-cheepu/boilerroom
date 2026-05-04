/** Vercel Blob rejects `access: "public"` when the store is configured as private. */
export function isPrivateStorePublicAccessError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error ?? "");
  return msg.toLowerCase().includes("cannot use public access on a private store");
}
