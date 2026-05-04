"use client";

import { upload } from "@vercel/blob/client";
import { useCallback, useState } from "react";
import { buildHeroBlobPathname } from "@/lib/admin/hero-video/build-hero-blob-pathname";
import { MAX_HERO_VIDEO_BYTES } from "@/lib/admin/hero-video/constants";
import { persistHeroVideoUrl } from "@/lib/admin/hero-video/persist-hero-video-url";
import { validateHeroVideoFile } from "@/lib/admin/hero-video/validate-hero-video-file";

export type HeroUploadPhase =
  | "idle"
  | "uploading"
  | "saving"
  | "success"
  | "error";

export function useHeroVideoUpload() {
  const [phase, setPhase] = useState<HeroUploadPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const resetStatus = useCallback(() => {
    setMessage(null);
    setProgress(0);
    setPhase("idle");
  }, []);

  const uploadFile = useCallback(
    async (file: File): Promise<{ ok: true } | { ok: false; error: string }> => {
      setMessage(null);
      setProgress(0);
      const v = validateHeroVideoFile(file);
      if (!v.ok) {
        setPhase("error");
        setMessage(v.message);
        return { ok: false, error: v.message };
      }

      setPhase("uploading");
      setProgress(0);
      const pathname = buildHeroBlobPathname(file);

      let blobUrl = "";
      try {
        const result = await upload(pathname, file, {
          access: "public",
          handleUploadUrl: "/api/admin/hero-video",
          /* Multipart + handleUpload has been flaky in serverless; single-shot upload is more reliable. */
          multipart: false,
          contentType: file.type || undefined,
          onUploadProgress: ({ percentage }) => {
            setProgress(Math.round(percentage));
          },
        });
        blobUrl = result.url;
      } catch (e) {
        const err = e instanceof Error ? e.message : "Upload failed.";
        setPhase("error");
        setMessage(err);
        setProgress(0);
        return { ok: false, error: err };
      }

      setPhase("saving");
      setProgress(100);
      const saved = await persistHeroVideoUrl(blobUrl);
      if (!saved.ok) {
        setPhase("error");
        setMessage(saved.message);
        return { ok: false, error: saved.message };
      }

      setPhase("success");
      setMessage(null);
      setProgress(0);
      return { ok: true };
    },
    [],
  );

  return {
    phase,
    progress,
    message,
    maxBytes: MAX_HERO_VIDEO_BYTES,
    resetStatus,
    uploadFile,
  };
}
