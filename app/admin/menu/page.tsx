import Link from "next/link";
import {
  createMenuCategoryAction,
  createMenuItemAction,
  deleteMenuCategoryAction,
  deleteMenuItemAction,
} from "@/app/actions/cms";
import { AdminNav } from "@/components/admin/AdminNav";
import { prisma } from "@/lib/prisma";

export default async function AdminMenuPage() {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-300">
        ← Admin home
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold uppercase text-white">
        Menu
      </h1>
      <div className="mt-6">
        <AdminNav />
      </div>

      <div className="mt-10 space-y-10">
        {categories.map((cat) => (
          <section
            key={cat.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  {cat.kind}
                </p>
                <h2 className="font-display text-xl font-semibold text-white">
                  {cat.label}
                </h2>
              </div>
              <form action={deleteMenuCategoryAction}>
                <input type="hidden" name="id" value={cat.id} />
                <button
                  type="submit"
                  className="text-sm text-red-400 hover:underline"
                >
                  Delete category
                </button>
              </form>
            </div>
            <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
              {cat.items.map((it) => (
                <li
                  key={it.id}
                  className="flex flex-col gap-2 rounded-lg bg-black/20 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-white">{it.name}</p>
                    {it.note ? (
                      <p className="text-xs text-zinc-500">{it.note}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-display text-br-accent">{it.price}</span>
                    <form action={deleteMenuItemAction}>
                      <input type="hidden" name="id" value={it.id} />
                      <button
                        type="submit"
                        className="text-xs text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>

            <form
              action={createMenuItemAction}
              className="mt-6 grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4 sm:grid-cols-2"
            >
              <input type="hidden" name="categoryId" value={cat.id} />
              <h3 className="sm:col-span-2 text-sm font-semibold text-zinc-300">
                Add item to {cat.label}
              </h3>
              <label className="text-xs text-zinc-400 sm:col-span-2">
                Name
                <input
                  name="name"
                  required
                  className="mt-1 w-full min-h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white"
                />
              </label>
              <label className="text-xs text-zinc-400">
                Price
                <input
                  name="price"
                  required
                  placeholder="$14"
                  className="mt-1 w-full min-h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white"
                />
              </label>
              <label className="text-xs text-zinc-400">
                Note (optional)
                <input
                  name="note"
                  className="mt-1 w-full min-h-10 rounded-lg border border-white/15 bg-black/40 px-3 text-sm text-white"
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="min-h-10 rounded-lg bg-white/10 px-4 text-sm font-medium text-white hover:bg-white/15"
                >
                  Add item
                </button>
              </div>
            </form>
          </section>
        ))}
      </div>

      <form
        action={createMenuCategoryAction}
        className="mt-12 flex flex-col gap-4 rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 sm:flex-row sm:items-end"
      >
        <h2 className="w-full text-lg font-semibold text-white sm:w-auto">
          New category
        </h2>
        <label className="flex-1 text-sm text-zinc-300">
          Label
          <input
            name="label"
            required
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 text-white"
          />
        </label>
        <label className="text-sm text-zinc-300">
          Kind
          <select
            name="kind"
            required
            className="mt-1 w-full min-h-11 rounded-lg border border-white/15 bg-black/30 px-3 text-white"
          >
            <option value="food">Food</option>
            <option value="drink">Drink</option>
          </select>
        </label>
        <button
          type="submit"
          className="min-h-11 rounded-xl bg-br-accent px-6 font-semibold text-white"
        >
          Add category
        </button>
      </form>
    </div>
  );
}
