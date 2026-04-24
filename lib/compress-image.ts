export async function compressImageToMaxBytes(
  inputFile: File,
  maxBytes = 5 * 1024 * 1024,
): Promise<File> {
  if (inputFile.size <= maxBytes) return inputFile;

  const bitmap = await createImageBitmap(inputFile);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return inputFile;

  const supportsWebp = (() => {
    try {
      return canvas.toDataURL("image/webp").startsWith("data:image/webp");
    } catch {
      return false;
    }
  })();
  const outputType = supportsWebp ? "image/webp" : "image/jpeg";

  let width = bitmap.width;
  let height = bitmap.height;
  let quality = 0.9;
  let bestBlob: Blob | null = null;

  const encode = () =>
    new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, outputType, quality);
    });

  for (let pass = 0; pass < 11; pass += 1) {
    canvas.width = Math.max(240, Math.round(width));
    canvas.height = Math.max(240, Math.round(height));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await encode();
    if (!blob) break;
    bestBlob = blob;
    if (blob.size <= maxBytes) break;

    if (quality > 0.48) {
      quality -= 0.08;
    } else {
      width *= 0.87;
      height *= 0.87;
    }
  }

  bitmap.close();
  if (!bestBlob) return inputFile;
  if (bestBlob.size > inputFile.size && inputFile.size <= maxBytes) return inputFile;

  const base = inputFile.name.replace(/\.[^.]+$/, "");
  const ext = outputType === "image/webp" ? "webp" : "jpg";
  return new File([bestBlob], `${base}.${ext}`, {
    type: outputType,
    lastModified: Date.now(),
  });
}
