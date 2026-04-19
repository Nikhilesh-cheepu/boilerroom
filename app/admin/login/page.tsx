import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-10 text-center">
        <Link
          href="/"
          className="font-display text-2xl font-bold uppercase tracking-[0.2em] text-white"
        >
          Boiler Room
        </Link>
        <p className="mt-2 text-sm text-zinc-400">Admin</p>
      </div>
      <LoginForm />
      <Link
        href="/"
        className="mt-10 text-sm text-zinc-500 underline-offset-4 hover:text-zinc-300 hover:underline"
      >
        Back to site
      </Link>
    </div>
  );
}
