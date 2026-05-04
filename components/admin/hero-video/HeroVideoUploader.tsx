"use client";

import { Film, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useHeroVideoUpload } from "@/hooks/useHeroVideoUpload";
import { formatFileSize } from "@/lib/admin/hero-video/format-file-size";
import { validateHeroVideoFile } from "@/lib/admin/hero-video/validate-hero-video-file";
import { cn } from "@/lib/utils";
import { HeroVideoDropzone } from "./HeroVideoDropzone";
import { HeroVideoUploadProgress } from "./HeroVideoUploadProgress";

type Props = {
  blobReady: boolean;
};

export function HeroVideoUploader({ blobReady }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { phase, progress, message, uploadFile, resetStatus } =
    useHeroVideoUpload();
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const busy = phase === "uploading" || phase === "saving" || isPending;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!blobReady || !file || busy) return;
    const v = validateHeroVideoFile(file);
    if (!v.ok) {
      toast.error(v.message);
      return;
    }
    const ok = await uploadFile(file);
    if (ok) {
      toast.success("Hero video updated", {
        description: "Homepage is serving the new clip.",
      });
      setFile(null);
      resetStatus();
      startTransition(() => router.refresh());
    } else if (message) {
      toast.error(message);
    }
  }

  function clearSelection() {
    if (busy) return;
    setFile(null);
    resetStatus();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {!blobReady ? (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
          Set{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs">
            BLOB_READ_WRITE_TOKEN
          </code>{" "}
          on the server (e.g. Vercel env) to enable uploads.
        </div>
      ) : null}

      <HeroVideoDropzone
        disabled={!blobReady}
        busy={busy}
        onFile={(f) => {
          resetStatus();
          setFile(f);
        }}
      />

      {file ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 sm:flex-row sm:items-center">
          <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
            {previewUrl ? (
              <video
                src={previewUrl}
                className="h-full w-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <Film className="mt-0.5 size-4 shrink-0 text-zinc-500" aria-hidden />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-100">{file.name}</p>
                <p className="text-xs text-zinc-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearSelection}
              disabled={busy}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.08] disabled:opacity-40"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Remove file
            </button>
          </div>
        </div>
      ) : null}

      {phase === "uploading" ? (
        <HeroVideoUploadProgress label="Uploading to Blob" percent={progress} />
      ) : null}
      {phase === "saving" ? (
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="size-4 animate-spin text-sky-400" aria-hidden />
          Saving to site…
        </div>
      ) : null}

      {message && phase === "error" ? (
        <p className="text-sm text-red-400/95" role="alert">
          {message}
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={!blobReady || !file || busy}
          className={cn(
            "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition",
            "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-900/30",
            "hover:from-sky-400 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-45",
          )}
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <UploadCloud className="size-4" aria-hidden />
          )}
          {busy
            ? phase === "saving"
              ? "Saving…"
              : `Uploading ${progress}%`
            : "Upload & set as hero"}
        </button>
      </div>
    </form>
  );
}
