import type { Metadata } from "next";
import { DM_Sans, Oswald } from "next/font/google";
import "./globals.css";

const display = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Boiler Room — Club · Kitchen · Sound",
  description:
    "Events, residents, food & drinks. Book a table on WhatsApp. Late-night energy, every week.",
  icons: {
    icon: "/boilerroom-logo.png",
    shortcut: "/boilerroom-logo.png",
    apple: "/boilerroom-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} h-full scroll-pt-20 antialiased`}
    >
      <body
        className={`${sans.className} min-h-full bg-br-bg text-br-text font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
