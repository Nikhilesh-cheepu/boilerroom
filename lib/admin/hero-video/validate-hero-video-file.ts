import { MAX_HERO_VIDEO_BYTES, HERO_VIDEO_MIME_TYPES } from "./constants";

export type HeroVideoFileValidation =
  | { ok: true }
  | { ok: false; message: string };

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

export function validateHeroVideoFile(file: File): HeroVideoFileValidation {
  if (file.size > MAX_HERO_VIDEO_BYTES) {
    return { ok: false, message: "Max file size is 100MB." };
  }

  if (file.type) {
    if (!HERO_VIDEO_MIME_TYPES.has(file.type)) {
      return {
        ok: false,
        message: "Unsupported format. Use MP4, WebM, or MOV.",
      };
    }
    return { ok: true };
  }

  if (!VIDEO_EXT.test(file.name)) {
    return {
      ok: false,
      message: "Could not detect video type. Use .mp4, .webm, or .mov.",
    };
  }

  return { ok: true };
}
