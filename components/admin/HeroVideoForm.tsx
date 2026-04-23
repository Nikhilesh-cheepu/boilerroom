"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MAX_BYTES = 100 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
]);

export function HeroVideoForm({ blobReady }: { blobReady: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);
    if (!file) {
      setError("Choose a video file.");
      return;
    }
    if (file.type && !ALLOWED_MIME.has(file.type)) {
      setError("Use MP4, WebM, or MOV.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Max file size is 100MB.");
      return;
    }

    setUploading(true);
    setProgress(0);
    let uploadedUrl = "";
    try {
      const uploaded = await upload(`boiler-room/hero/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/hero-video",
        onUploadProgress: (e) => {
          setProgress(Math.round(e.percentage));
        },
      });
      uploadedUrl = uploaded.url;
    } catch (e) {
      setUploading(false);
      setError(e instanceof Error ? e.message : "Upload failed.");
      setProgress(null);
      return;
    }

    try {
      const res = await fetch("/api/admin/hero-video", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: uploadedUrl }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? `Save failed (${res.status}).`);
      }
    } catch (e) {
      setUploading(false);
      setError(
        e instanceof Error
          ? e.message
          : "Upload succeeded but saving hero video failed.",
      );
      setProgress(null);
      return;
    }

    setUploading(false);
    setOk(true);
    setFile(null);
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!blobReady ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
          Add{" "}
          <code className="rounded bg-black/40 px-1 font-mono text-xs">
            BLOB_READ_WRITE_TOKEN
          </code>{" "}
          in your server environment to enable uploads (Vercel Blob).
        </p>
      ) : null}

      <label className="group block cursor-pointer rounded-2xl border border-dashed border-[#6b5344]/60 bg-[#12100e]/60 px-4 py-8 text-center transition hover:border-[#c9a227]/60 hover:bg-[#1c1814]/60">
        <input
          ref={inputRef}
          name="video"
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
          disabled={!blobReady || uploading}
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <span className="text-sm font-medium text-[#d4c4a8]">
          {file ? file.name : "Drop a file or tap to choose"}
        </span>
        <span className="mt-1 block text-xs text-[#8b7355]">
          MP4, WebM, MOV · max 100MB · stored on Vercel Blob
        </span>
      </label>

      {file && previewUrl ? (
        <div className="flex items-center gap-3 rounded-xl border border-[#3a322a] bg-[#0f0d0b]/70 px-3 py-2">
          <div className="h-14 w-24 overflow-hidden rounded-md border border-[#4a3f35] bg-[#1b1713]">
            <video
              src={previewUrl}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#e6d7c2]">{file.name}</p>
            <p className="text-xs text-[#9b8566]">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
        </div>
      ) : null}

      {progress !== null ? (
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-[#2a241c]"
          aria-label="Upload progress"
        >
          <div
            className="h-full bg-gradient-to-r from-[#8b6914] to-[#c9a227] transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="text-sm text-[#c9a227]">Video saved. Homepage updated.</p>
      ) : null}

      <button
        type="submit"
        disabled={!blobReady || uploading || !file}
        className="min-h-12 rounded-xl border border-[#8b6914]/60 bg-gradient-to-r from-[#4a3d2e] to-[#2e261c] font-semibold text-[#f5ead8] shadow-lg transition hover:border-[#c9a227]/70 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading
          ? progress != null
            ? `Uploading… ${progress}%`
            : "Uploading…"
          : "Save hero video"}
      </button>
    </form>
  );
}
