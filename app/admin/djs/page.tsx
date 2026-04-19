import Link from "next/link";
import { createResidentAction, deleteResidentAction } from "@/app/actions/cms";
import { AdminNav } from "@/components/admin/AdminNav";
import { prisma } from "@/lib/prisma";

export default async function AdminDjsPage() {
  const rows = await prisma.resident.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-300">
        ← Admin home
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold uppercase text-white">
        DJs
      </h1>
      <div className="mt-6">
        <AdminNav />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-zinc-400">
            <tr>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Tags</th>
              <th className="p-3 font-medium">Gradient</th>
              <th className="p-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-white/5 last:border-0">
                <td className="p-3 text-white">{r.name}</td>
                <td className="p-3 text-zinc-300">{r.tags}</td>
                <td className="max-w-[220px] truncate p-3 font-mono text-xs text-zinc-500">
                  {r.gradient}
                </td>
                <td className="p-3">
                  <form action={deleteResidentAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        action={createResidentAction}
        className="mt-10 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 sm:grid-cols-2"
      >
        <h2 className="sm:col-span-2 text-lg font-semibold text-white">
          Add DJ
        </h2>
        <label className="text-sm text-zinc-300 sm:col-span-2">
          Name
          <input
            name="name"
            required
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300 sm:col-span-2">
          Tags (comma-separated)
          <input
            name="tags"
            placeholder="House, Vocal"
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300 sm:col-span-2">
          Tailwind gradient classes
          <input
            name="gradient"
            required
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 font-mono text-sm text-white"
          />
        </label>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="min-h-11 rounded-xl bg-br-accent px-6 font-semibold text-white"
          >
            Add DJ
          </button>
        </div>
      </form>
    </div>
  );
}
