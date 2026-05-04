"use client";

import { upload } from "@vercel/blob/client";
import { useCallback, useState } from "react";
import { buildHeroBlobPathnameForToken } from "@/lib/admin/hero-video/build-hero-blob-pathname";
import { MAX_HERO_VIDEO_BYTES } from "@/lib/admin/hero-video/constants";
import { persistHeroVideoUrl } from "@/lib/admin/hero-video/persist-hero-video-url";
import { validateHeroVideoFile } from "@/lib/admin/hero-video/validate-hero-video-file";
import { shouldUseHeroBlobProxyUpload } from "@/lib/admin/hero-video/use-blob-proxy-upload";
import { isPrivateStorePublicAccessError } from "@/lib/blob/private-store-error";

export type HeroUploadPhase =
  | "idle"
  | "uploading"
  | "saving"
  | "success"
  | "error";

/** XHR upload with progress — same-origin, works on localhost. */
function postFormDataWithProgress(
  url: string,
  formData: FormData,
  onProgress: (pct: number) => void,
): Promise<{ ok: boolean; status: number; bodyText: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.withCredentials = true;
    xhr.responseType = "text";
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable && ev.total > 0) {
        onProgress(Math.min(99, Math.round((ev.loaded / ev.total) * 100)));
      }
    };
    xhr.onload = () => {
      resolve({
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        bodyText: xhr.responseText ?? "",
      });
    };
    xhr.onerror = () => reject(new TypeError("Network request failed"));
    xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"));
    xhr.send(formData);
  });
}

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

      if (shouldUseHeroBlobProxyUpload()) {
        try {
          const fd = new FormData();
          fd.set("file", file);
          const res = await postFormDataWithProgress(
            "/api/admin/hero-video/body",
            fd,
            (pct) => setProgress(pct),
          );
          setProgress(100);
          let data: { error?: string; url?: string } = {};
          if (res.bodyText.trim()) {
            try {
              data = JSON.parse(res.bodyText) as typeof data;
            } catch {
              /* ignore */
            }
          }
          if (!res.ok) {
            const err = data.error ?? `Upload failed (${res.status}).`;
            setPhase("error");
            setMessage(err);
            setProgress(0);
            return { ok: false, error: err };
          }
          setPhase("success");
          setMessage(null);
          setProgress(0);
          return { ok: true };
        } catch (e) {
          const err = e instanceof Error ? e.message : "Upload failed.";
          setPhase("error");
          setMessage(err);
          setProgress(0);
          return { ok: false, error: err };
        }
      }

      const pathname = buildHeroBlobPathnameForToken(file.name);

      let blobUrl = "";
      const uploadOpts = {
        handleUploadUrl: "/api/admin/hero-video",
        multipart: false,
        contentType: file.type || undefined,
        onUploadProgress: ({ percentage }: { percentage: number }) => {
          setProgress(Math.round(percentage));
        },
      } as const;
      try {
        const result = await upload(pathname, file, {
          ...uploadOpts,
          access: "public",
        });
        blobUrl = result.url;
      } catch (e) {
        if (!isPrivateStorePublicAccessError(e)) {
          const err = e instanceof Error ? e.message : "Upload failed.";
          setPhase("error");
          setMessage(err);
          setProgress(0);
          return { ok: false, error: err };
        }
        try {
          const result = await upload(pathname, file, {
            ...uploadOpts,
            access: "private",
          });
          blobUrl = result.url;
        } catch (e2) {
          const err = e2 instanceof Error ? e2.message : "Upload failed.";
          setPhase("error");
          setMessage(err);
          setProgress(0);
          return { ok: false, error: err };
        }
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
