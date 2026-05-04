"use client";

import { upload } from "@vercel/blob/client";
import { useCallback, useState } from "react";
import { buildHeroBlobPathname } from "@/lib/admin/hero-video/build-hero-blob-pathname";
import {
  HERO_VIDEO_MULTIPART_THRESHOLD_BYTES,
  MAX_HERO_VIDEO_BYTES,
} from "@/lib/admin/hero-video/constants";
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

  const uploadFile = useCallback(async (file: File): Promise<boolean> => {
      setMessage(null);
      setProgress(0);
      const v = validateHeroVideoFile(file);
      if (!v.ok) {
        setPhase("error");
        setMessage(v.message);
        return false;
      }

      setPhase("uploading");
      setProgress(0);
      const pathname = buildHeroBlobPathname(file);
      const useMultipart = file.size >= HERO_VIDEO_MULTIPART_THRESHOLD_BYTES;

      let blobUrl = "";
      try {
        const result = await upload(pathname, file, {
          access: "public",
          handleUploadUrl: "/api/admin/hero-video",
          multipart: useMultipart,
          contentType: file.type || undefined,
          onUploadProgress: ({ percentage }) => {
            setProgress(Math.round(percentage));
          },
        });
        blobUrl = result.url;
      } catch (e) {
        setPhase("error");
        setMessage(e instanceof Error ? e.message : "Upload failed.");
        setProgress(0);
        return false;
      }

      setPhase("saving");
      setProgress(100);
      const saved = await persistHeroVideoUrl(blobUrl);
      if (!saved.ok) {
        setPhase("error");
        setMessage(saved.message);
        return false;
      }

      setPhase("success");
      setMessage(null);
      setProgress(0);
      return true;
  }, []);

  return {
    phase,
    progress,
    message,
    maxBytes: MAX_HERO_VIDEO_BYTES,
    resetStatus,
    uploadFile,
  };
}
