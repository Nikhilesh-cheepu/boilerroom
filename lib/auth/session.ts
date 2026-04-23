import { SignJWT, jwtVerify } from "jose";

const COOKIE = "br_admin";
const DAY_MS = 86_400_000;

/** Works in Node and Edge (Web Crypto) — must match for login + proxy. */
async function getSecretKey(): Promise<Uint8Array | null> {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim();
  if (explicit && explicit.length >= 16) {
    return new TextEncoder().encode(explicit);
  }
  const pw = process.env.ADMIN_PASSWORD;
  if (pw === undefined || pw === null || String(pw) === "") return null;
  const data = new TextEncoder().encode(
    `boilerroom.admin.session|${String(pw)}`,
  );
  const buf = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(buf);
}

export async function createAdminSessionToken(): Promise<string> {
  const key = await getSecretKey();
  if (!key) {
    throw new Error(
      "Set ADMIN_PASSWORD in .env.local (and optionally ADMIN_SESSION_SECRET).",
    );
  }
  return new SignJWT({ role: "admin" as const })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyAdminSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const key = await getSecretKey();
  if (!key) return false;
  try {
    await jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}

export { COOKIE as ADMIN_SESSION_COOKIE };

export function adminSessionCookieOptions() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function sessionMaxAgeMs() {
  return 7 * DAY_MS;
}
