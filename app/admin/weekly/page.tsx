import Link from "next/link";
import { createWeeklyAction, deleteWeeklyAction } from "@/app/actions/cms";
import { AdminNav } from "@/components/admin/AdminNav";
import { prisma } from "@/lib/prisma";

export default async function AdminWeeklyPage() {
  const rows = await prisma.weeklySlot.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-300">
        ← Admin home
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold uppercase text-white">
        Weekly rhythm
      </h1>
      <div className="mt-6">
        <AdminNav />
      </div>

      <ul className="mt-8 space-y-3">
        {rows.map((w) => (
          <li
            key={w.id}
            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display text-br-accent">{w.day}</p>
              <p className="text-sm text-white">{w.vibe}</p>
              <p className="text-xs text-zinc-500">{w.time}</p>
            </div>
            <form action={deleteWeeklyAction}>
              <input type="hidden" name="id" value={w.id} />
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
        action={createWeeklyAction}
        className="mt-10 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 sm:grid-cols-3"
      >
        <h2 className="sm:col-span-3 text-lg font-semibold text-white">
          Add row
        </h2>
        <label className="text-sm text-zinc-300">
          Day
          <input
            name="day"
            required
            placeholder="Fri"
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300 sm:col-span-2">
          Vibe
          <input
            name="vibe"
            required
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300 sm:col-span-3">
          Hours
          <input
            name="time"
            required
            placeholder="10pm–4am"
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 text-white"
          />
        </label>
        <div className="sm:col-span-3">
          <button
            type="submit"
            className="min-h-11 rounded-xl bg-br-accent px-6 font-semibold text-white"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
