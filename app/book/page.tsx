import type { Metadata } from "next";
import Link from "next/link";
import { BookTableFlow } from "@/components/book/BookTableFlow";

function BackIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Book a table — Boiler Room",
  description: "Reserve a table at Boiler Room — pick date, time, and party size.",
};

export default function BookPage() {
  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(38vh,360px)] bg-[radial-gradient(ellipse_75%_55%_at_50%_-5%,rgba(200,208,232,0.07),transparent_58%)]"
        aria-hidden
      />
      <header className="relative z-10 border-b border-[color:var(--bp-line)] px-3 py-2">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--bp-muted)] transition hover:text-[var(--bp-accent)]"
        >
          <span className="flex size-6 items-center justify-center rounded-full text-[var(--bp-muted)] transition group-hover:text-[var(--bp-accent)]">
            <BackIcon className="size-3" />
          </span>
          Back
        </Link>
      </header>
      <BookTableFlow />
    </div>
  );
}
