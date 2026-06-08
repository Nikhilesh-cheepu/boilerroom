"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { compressImageToMaxBytes } from "@/lib/compress-image";

type UploadState = "idle" | "uploading" | "done" | "error";

/** Vercel serverless body limit is ~4.5MB — compress larger images before same-origin upload. */
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

function fileAlt(name: string): string {
  return name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
}

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

export function GalleryUploadForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<UploadState>("idle");
  const [status, setStatus] = useState("Drop images or choose files.");
  const [progress, setProgress] = useState(0);

  const busy = useMemo(() => isPending || state === "uploading", [isPending, state]);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length || busy) return;
    setState("uploading");
    setProgress(0);
    let done = 0;

    try {
      for (const rawFile of Array.from(files)) {
        if (!rawFile.type.startsWith("image/")) {
          throw new Error(`Unsupported file: ${rawFile.name}`);
        }
        setStatus(`Preparing ${rawFile.name}...`);
        const file =
          rawFile.size > MAX_UPLOAD_BYTES
            ? await compressImageToMaxBytes(rawFile, MAX_UPLOAD_BYTES)
            : rawFile;

        setStatus(`Uploading ${rawFile.name}...`);
        const fd = new FormData();
        fd.set("file", file);
        fd.set("alt", fileAlt(rawFile.name));
        const res = await postFormDataWithProgress(
          "/api/admin/gallery/body",
          fd,
          (pct) => setProgress(Math.round(((done + pct / 100) / files.length) * 100)),
        );
        let data: { error?: string; url?: string } = {};
        if (res.bodyText.trim()) {
          try {
            data = JSON.parse(res.bodyText) as typeof data;
          } catch {
            /* ignore */
          }
        }
        if (!res.ok || !data.url) {
          throw new Error(data.error ?? `Upload failed (${res.status}).`);
        }
        done += 1;
        setProgress(Math.round((done / files.length) * 100));
      }

      setState("done");
      setStatus(`Uploaded ${done} image${done === 1 ? "" : "s"} successfully.`);
      startTransition(() => router.refresh());
    } catch (error) {
      setState("error");
      setStatus(error instanceof Error ? error.message : "Upload failed");
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <h2 className="text-base font-semibold text-white">Upload gallery images</h2>
      <p className="mt-1 text-xs text-zinc-400">Supports JPG, PNG, WebP, GIF. Large images are compressed client-side.</p>

      <label
        htmlFor="gallery-files"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void uploadFiles(e.dataTransfer.files);
        }}
        className="mt-4 flex min-h-28 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#b8c7ff44] bg-[#0a1120] px-4 text-center text-sm text-[#dbe5ff] hover:border-[#cfdbff77]"
      >
        {busy ? "Uploading..." : "Drag & drop images here or tap to choose"}
      </label>
      <input
        id="gallery-files"
        type="file"
        accept="image/*"
        multiple
        disabled={busy}
        className="sr-only"
        onChange={(e) => {
          void uploadFiles(e.target.files);
          e.currentTarget.value = "";
        }}
      />

      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#b8c7ff]"
            style={{ width: `${progress}%`, transition: "width 220ms ease" }}
          />
        </div>
        <p className="mt-2 text-xs text-zinc-300">{status}</p>
      </div>
      {state === "error" ? (
        <p className="mt-2 text-xs text-red-300">Please retry upload.</p>
      ) : null}
    </section>
  );
}
