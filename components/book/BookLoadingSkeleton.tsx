export function BookLoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[min(100%,22rem)] space-y-4 px-4 py-6">
      <div className="space-y-2">
        <div className="h-7 w-40 animate-pulse rounded-md bg-[var(--bp-surface)]" />
        <div className="h-3 w-52 animate-pulse rounded bg-[var(--bp-surface)]" />
      </div>
      <div className="h-px w-full bg-[color:var(--bp-line)]" />
      <div className="h-14 animate-pulse rounded-full bg-[var(--bp-surface)]" />
      <div className="h-10 animate-pulse rounded-full bg-[var(--bp-surface)]" />
      <div className="h-36 animate-pulse rounded-xl bg-[var(--bp-surface)]" />
    </div>
  );
}
