import { HERO_BLOB_PREFIX } from "./constants";

/** Safe object key for Vercel Blob; server uses addRandomSuffix. */
export function buildHeroBlobPathname(file: File): string {
  const raw = file.name.trim() || "hero-video";
  const noPath = raw.replace(/^.*[/\\]/, "");
  const safe = noPath.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  const base = (safe.length > 0 ? safe : "hero-video").slice(0, 96);
  return `${HERO_BLOB_PREFIX}${Date.now()}-${base}`;
}
