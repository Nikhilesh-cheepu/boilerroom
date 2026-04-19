"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ShelfScrollerProps = {
  children: ReactNode;
  className?: string;
  /** Accessible name when not using aria-labelledby. */
  ariaLabel: string;
};

/** Horizontal snap row — keyboard-focusable cards should live inside. */
export function ShelfScroller({
  children,
  className,
  ariaLabel,
}: ShelfScrollerProps) {
  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cn(
        "shelf-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 pt-1 [-webkit-overflow-scrolling:touch] sm:gap-5 sm:px-6 lg:px-8",
        "[scrollbar-gutter:stable]",
        className,
      )}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
