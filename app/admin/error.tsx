"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const msg = error.message ?? "";
  const migrateHint =
    /column|does not exist|P2022|Unknown argument/i.test(msg) ||
    /PrismaClientKnownRequestError|PrismaClientValidationError/i.test(
      String(error),
    );

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-display text-xl font-semibold uppercase tracking-wide text-white">
        Admin could not load
      </h1>
      <p className="mt-3 text-sm text-zinc-400">{msg}</p>
      {migrateHint ? (
        <p className="mt-4 text-left text-xs leading-relaxed text-zinc-500">
          From the project root:{" "}
          <code className="rounded bg-black/50 px-1 py-0.5 text-zinc-300">
            npm run db:sync
          </code>{" "}
          (regenerates the Prisma client and updates the database), or run{" "}
          <code className="rounded bg-black/50 px-1 py-0.5 text-zinc-300">
            npx prisma generate
          </code>{" "}
          then{" "}
          <code className="rounded bg-black/50 px-1 py-0.5 text-zinc-300">
            npm run db:push
          </code>
          . Stop the dev server, delete the{" "}
          <code className="text-zinc-300">.next</code> folder if the error
          persists, then start <code className="text-zinc-300">npm run dev</code>{" "}
          again — <code className="text-zinc-300">npm run dev</code> runs{" "}
          <code className="text-zinc-300">prisma generate</code> first via{" "}
          <code className="text-zinc-300">predev</code>.
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-white/10"
      >
        Try again
      </button>
    </div>
  );
}
