const PATCH_TIMEOUT_MS = 45_000;

/** Persist Blob URL to SiteSettings after client upload completes. */
export async function persistHeroVideoUrl(
  url: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const controller = new AbortController();
  const t = window.setTimeout(() => controller.abort(), PATCH_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch("/api/admin/hero-video", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      credentials: "same-origin",
      signal: controller.signal,
    });
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      return {
        ok: false,
        message: `Save timed out after ${PATCH_TIMEOUT_MS / 1000}s. Check your connection and try again.`,
      };
    }
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Could not reach server to save video.",
    };
  } finally {
    window.clearTimeout(t);
  }

  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    return {
      ok: false,
      message: data.error ?? `Save failed (${res.status}).`,
    };
  }
  return { ok: true };
}
