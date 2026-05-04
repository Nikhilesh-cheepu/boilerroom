import { get } from "@vercel/blob";

function safeBlobTarget(
  raw: string | null,
): { url: string; pathname: string } | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:") return null;
    if (!host.endsWith("blob.vercel-storage.com")) return null;
    const pathname = url.pathname.startsWith("/")
      ? url.pathname.slice(1)
      : url.pathname;
    if (!pathname) return null;
    return { url: url.toString(), pathname };
  } catch {
    return null;
  }
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const target = safeBlobTarget(url.searchParams.get("src"));
  if (!target) return new Response("Invalid source", { status: 400 });

  const range = request.headers.get("range");
  const rangeHeaders = range ? { Range: range } : undefined;

  try {
    // Must pass the full Blob URL, not pathname alone: pathname + `access: "private"`
    // builds `*.private.blob.vercel-storage.com`, while uploads often return
    // `*.public.blob.vercel-storage.com` — wrong host → empty / broken video.
    const res = await get(target.url, {
      access: "private",
      headers: rangeHeaders,
      useCache: true,
    });

    if (!res) return new Response("Not found", { status: 404 });
    const safeHeaders = new Headers(
      Array.from(res.headers.entries()).map(([k, v]) => [k, v]),
    );
    if (res.statusCode === 304) {
      return new Response(null, { status: 304, headers: safeHeaders });
    }

    const status =
      range && safeHeaders.has("content-range") ? 206 : 200;

    return new Response(res.stream, {
      status,
      headers: safeHeaders,
    });
  } catch {
    // Unauthenticated fetch only works for public blobs (private → 403).
    const upstream = await fetch(target.url, {
      headers: rangeHeaders,
      cache: "force-cache",
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: upstream.headers,
    });
  }
}
