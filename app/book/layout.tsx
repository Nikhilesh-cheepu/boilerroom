import { Fraunces } from "next/font/google";
import "./book-skin.css";

const bookSerif = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-book-serif",
});

export default function BookLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${bookSerif.variable} book-premium min-h-dvh bg-[var(--bp-bg)] text-[var(--bp-text)] font-sans text-[15px] leading-snug antialiased`}
    >
      {children}
    </div>
  );
}
