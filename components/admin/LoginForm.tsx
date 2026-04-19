"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <form action={action} className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <label className="text-sm font-medium text-zinc-300">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full min-h-12 rounded-xl border border-white/15 bg-black/40 px-4 text-base text-white outline-none ring-br-accent focus:ring-2"
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
        className="min-h-12 rounded-xl bg-br-accent font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
