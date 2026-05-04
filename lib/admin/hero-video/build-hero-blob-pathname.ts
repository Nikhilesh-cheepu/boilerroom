import { HERO_BLOB_PREFIX } from "./constants";

/** Safe object key for Vercel Blob; server may use addRandomSuffix on the token. */
export function buildHeroBlobPathnameForToken(filename: string): string {
  const raw = filename.trim() || "hero-video";
  const noPath = raw.replace(/^.*[/\\]/, "");
  const safe = noPath.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  const base = (safe.length > 0 ? safe : "hero-video").slice(0, 96);
  return `${HERO_BLOB_PREFIX}${Date.now()}-${base}`;
}
