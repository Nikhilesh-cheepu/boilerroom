import Link from "next/link";
import { createFaqAction, deleteFaqAction } from "@/app/actions/cms";
import { AdminNav } from "@/components/admin/AdminNav";
import { prisma } from "@/lib/prisma";

export default async function AdminFaqPage() {
  const rows = await prisma.faqItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-300">
        ← Admin home
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold uppercase text-white">
        FAQ
      </h1>
      <div className="mt-6">
        <AdminNav />
      </div>

      <ul className="mt-8 space-y-4">
        {rows.map((f) => (
          <li
            key={f.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <p className="font-medium text-white">{f.q}</p>
            <p className="mt-2 text-sm text-zinc-400">{f.a}</p>
            <form action={deleteFaqAction} className="mt-3">
              <input type="hidden" name="id" value={f.id} />
              <button
                type="submit"
                className="text-sm text-red-400 hover:underline"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>

      <form
        action={createFaqAction}
        className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h2 className="text-lg font-semibold text-white">Add FAQ</h2>
        <label className="text-sm text-zinc-300">
          Question
          <input
            name="q"
            required
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300">
          Answer
          <textarea
            name="a"
            required
            rows={4}
            className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white"
          />
        </label>
        <button
          type="submit"
          className="min-h-11 rounded-xl bg-br-accent font-semibold text-white"
        >
          Add FAQ
        </button>
      </form>
    </div>
  );
}
