/** Persist Blob URL to SiteSettings after client upload completes. */
export async function persistHeroVideoUrl(
  url: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await fetch("/api/admin/hero-video", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
    credentials: "same-origin",
  });

  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    return {
      ok: false,
      message: data.error ?? `Save failed (${res.status}).`,
    };
  }
  return { ok: true };
}
