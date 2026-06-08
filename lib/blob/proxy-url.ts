/**
 * Private Vercel Blob URLs return 403 in the browser. Proxy through our API
 * (same pattern as homepage hero video).
 */
export function toBlobProxyUrl(pathOrUrl: string): string {
  if (!pathOrUrl.startsWith("http")) return pathOrUrl;
  if (pathOrUrl.includes("blob.vercel-storage.com")) {
    return `/api/hero-video?src=${encodeURIComponent(pathOrUrl)}`;
  }
  return pathOrUrl;
}
