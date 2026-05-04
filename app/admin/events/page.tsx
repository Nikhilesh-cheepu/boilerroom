import { createEventAction, deleteEventAction } from "@/app/actions/cms";
import { prisma } from "@/lib/prisma";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 border-b border-white/[0.08] pb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Events
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Homepage “What’s on” carousel.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-zinc-400">
            <tr>
              <th className="p-3 font-medium">Title</th>
              <th className="p-3 font-medium">When</th>
              <th className="p-3 font-medium">Room</th>
              <th className="p-3 font-medium">Genre</th>
              <th className="p-3 font-medium">Gradient class</th>
              <th className="p-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-b border-white/5 last:border-0">
                <td className="p-3 text-white">{e.title}</td>
                <td className="p-3 text-zinc-300">{e.dateLabel}</td>
                <td className="p-3 text-zinc-300">{e.room}</td>
                <td className="p-3 text-zinc-300">{e.genre}</td>
                <td className="max-w-[200px] truncate p-3 font-mono text-xs text-zinc-500">
                  {e.gradient}
                </td>
                <td className="p-3">
                  <form action={deleteEventAction}>
                    <input type="hidden" name="id" value={e.id} />
                    <button
                      type="submit"
                      className="text-red-400/90 transition hover:text-red-300"
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
        action={createEventAction}
        className="mt-10 grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2"
      >
        <h2 className="text-lg font-semibold text-white sm:col-span-2">Add event</h2>
        <label className="text-sm text-zinc-300 sm:col-span-2">
          Title
          <input
            name="title"
            required
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300 sm:col-span-2">
          Date label
          <input
            name="dateLabel"
            required
            placeholder="Fri · Apr 25 · 10pm"
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300">
          Room
          <input
            name="room"
            required
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300">
          Genre
          <input
            name="genre"
            required
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300 sm:col-span-2">
          Tailwind gradient classes
          <input
            name="gradient"
            required
            placeholder="from-fuchsia-950 via-violet-900 to-black"
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 font-mono text-sm text-white"
          />
        </label>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="min-h-11 rounded-xl bg-sky-600 px-6 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            Add event
          </button>
        </div>
      </form>
    </div>
  );
}
