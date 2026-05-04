/** Hero homepage video — client + server must stay in sync. */

export const HERO_BLOB_PREFIX = "hero/" as const;

export const MAX_HERO_VIDEO_BYTES = 100 * 1024 * 1024;

export const HERO_VIDEO_ACCEPT = {
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
  "video/quicktime": [".mov"],
  "video/x-m4v": [".m4v"],
} as const;

export const HERO_VIDEO_MIME_TYPES = new Set<string>([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
]);

/** Use multipart client upload for larger files (more reliable for big videos). */
export const HERO_VIDEO_MULTIPART_THRESHOLD_BYTES = 4 * 1024 * 1024;
