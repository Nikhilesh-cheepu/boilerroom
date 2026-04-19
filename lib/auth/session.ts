import { SignJWT, jwtVerify } from "jose";

const COOKIE = "br_admin";
const DAY_MS = 86_400_000;

function getSecretKey(): Uint8Array | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) return null;
  return new TextEncoder().encode(s);
}

export async function createAdminSessionToken(): Promise<string> {
  const key = getSecretKey();
  if (!key) {
    throw new Error(
      "Set ADMIN_SESSION_SECRET (min 16 chars) in .env.local for admin login.",
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
  const key = getSecretKey();
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
