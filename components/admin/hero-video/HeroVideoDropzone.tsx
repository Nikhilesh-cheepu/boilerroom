"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { HERO_VIDEO_ACCEPT } from "@/lib/admin/hero-video/constants";
import { cn } from "@/lib/utils";

type Props = {
  disabled: boolean;
  busy: boolean;
  onFile: (file: File) => void;
};

export function HeroVideoDropzone({ disabled, busy, onFile }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      const f = accepted[0];
      if (f) onFile(f);
    },
    [onFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    disabled: disabled || busy,
    accept: HERO_VIDEO_ACCEPT,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex min-h-[8.5rem] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-6 text-center transition",
        disabled || busy
          ? "cursor-not-allowed border-white/10 bg-white/[0.02] opacity-50"
          : isDragActive
            ? "border-[#7dd3fc]/55 bg-[#38bdf8]/10"
            : "border-white/20 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.05]",
      )}
    >
      <input {...getInputProps()} />
      <p className="text-sm font-medium text-zinc-200">
        {busy ? "Working…" : isDragActive ? "Drop video here" : "Drop video or tap to browse"}
      </p>
      <p className="mt-1.5 text-xs text-zinc-500">
        MP4, WebM, MOV · up to 100MB · Vercel Blob
      </p>
    </div>
  );
}
