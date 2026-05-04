/**
 * Browser → `vercel.com/api/blob` is blocked by CORS on `localhost` / `127.0.0.1`.
 * Use same-origin server upload instead (see `/api/admin/hero-video/body`).
 */
export function shouldUseHeroBlobProxyUpload(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1";
}
