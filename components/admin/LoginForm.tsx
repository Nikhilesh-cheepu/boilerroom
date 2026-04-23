"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="flex w-full flex-col gap-5">
      <label className="text-sm font-medium text-zinc-300">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full min-h-[52px] rounded-xl border border-white/15 bg-black/50 px-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/25"
          placeholder="••••"
        />
      </label>
      {state?.error ? (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-[52px] rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 font-semibold text-white shadow-lg shadow-teal-900/40 transition hover:opacity-95 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
