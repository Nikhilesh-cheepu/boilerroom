"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
} from "@/lib/auth/session";

export async function loginAction(
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string } | void> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || expected.length < 8) {
    return {
      error:
        "Server misconfigured: set ADMIN_PASSWORD (min 8 chars) in .env.local",
    };
  }
  if (password !== expected) {
    return { error: "Wrong password" };
  }

  const token = await createAdminSessionToken();
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions());
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
