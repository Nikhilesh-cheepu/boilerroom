"use client";

import { Drawer } from "vaul";
import { ContactSheetPortal } from "@/components/contact/ContactSheet";
import { getPublicEnv } from "@/lib/env";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function StickyDock() {
  const env = getPublicEnv();
  const bookHref = buildWhatsAppHref(env.phoneE164, env.bookingMessage);

  return (
    <Drawer.Root shouldScaleBackground={false}>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div
          className={cn(
            "pointer-events-auto flex w-full max-w-md gap-2 rounded-2xl border border-white/10 bg-black/85 p-2 shadow-[0_-8px_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:gap-3",
          )}
        >
          <a
            href={bookHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[48px] flex-1 touch-manipulation items-center justify-center rounded-xl bg-br-accent px-3 text-sm font-semibold text-white shadow-[0_0_24px_var(--br-glow)] transition-transform active:scale-[0.98] sm:min-h-12 sm:px-4 sm:hover:scale-[1.02]"
          >
            Book a table
          </a>
          <Drawer.Trigger asChild>
            <button
              type="button"
              className="flex min-h-[48px] flex-1 touch-manipulation items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 text-sm font-semibold text-br-text transition-colors active:bg-white/10 sm:min-h-12 sm:px-4 sm:hover:bg-white/10"
            >
              Contact
            </button>
          </Drawer.Trigger>
        </div>
      </div>

      <ContactSheetPortal />
    </Drawer.Root>
  );
}
