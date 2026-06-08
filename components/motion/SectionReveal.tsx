"use client";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Extra delay in seconds (staggered sections) — kept for API compat */
  delay?: number;
};

export function SectionReveal({ children, className }: Props) {
  return <div className={className}>{children}</div>;
}
