import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-10">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="font-display text-2xl font-bold uppercase tracking-[0.2em] text-white transition hover:text-teal-200/90"
          >
            Boiler Room
          </Link>
          <p className="mt-2 text-sm font-medium text-teal-500/80">Admin</p>
          <p className="mt-3 text-xs text-zinc-500">
            Enter the password from your server environment.
          </p>
        </div>
        <LoginForm />
      </div>
      <Link
        href="/"
        className="mt-10 text-sm text-zinc-500 underline-offset-4 transition hover:text-zinc-300 hover:underline"
      >
        ← Back to site
      </Link>
    </div>
  );
}
