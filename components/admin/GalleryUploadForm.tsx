"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { addGalleryImageFromUpload } from "@/app/actions/cms";
import { compressImageToMaxBytes } from "@/lib/compress-image";
import { isPrivateStorePublicAccessError } from "@/lib/blob/private-store-error";

type UploadState = "idle" | "uploading" | "done" | "error";

function fileAlt(name: string): string {
  return name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
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
          rawFile.size > 5 * 1024 * 1024
            ? await compressImageToMaxBytes(rawFile)
            : rawFile;

        setStatus(`Uploading ${rawFile.name}...`);
        const pathname = `gallery/${Date.now()}-${rawFile.name.replace(/\s+/g, "-").toLowerCase()}`;
        const uploadOpts = {
          handleUploadUrl: "/api/admin/blob",
        } as const;
        let blob;
        try {
          blob = await upload(pathname, file, { ...uploadOpts, access: "public" });
        } catch (e) {
          if (!isPrivateStorePublicAccessError(e)) throw e;
          blob = await upload(pathname, file, { ...uploadOpts, access: "private" });
        }
        await addGalleryImageFromUpload(blob.url, fileAlt(rawFile.name));
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
