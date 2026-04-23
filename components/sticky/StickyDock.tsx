"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Drawer } from "vaul";
import { ContactSheetPortal } from "@/components/contact/ContactSheet";
import type { ResolvedSiteContact } from "@/lib/site-contact";
import { cn } from "@/lib/utils";

export function StickyDock({ contact }: { contact: ResolvedSiteContact }) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <Drawer.Root shouldScaleBackground={false}>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        <motion.div
          className={cn(
            "pointer-events-auto flex w-full max-w-md gap-2 rounded-2xl border border-[#cad6ff26] bg-[#080b12]/92 p-2 shadow-[0_-12px_48px_rgba(0,0,0,0.68)] backdrop-blur-2xl sm:gap-2.5 sm:px-2.5 sm:pb-2.5",
          )}
          initial={reduceMotion ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        >
          <Drawer.Trigger asChild>
            <motion.button
              type="button"
              className="flex min-h-[52px] min-w-0 flex-1 touch-manipulation items-center justify-center rounded-xl border border-[#cad6ff2e] bg-[#bacbff0f] px-3 text-sm font-semibold text-[#eef2ff] transition-colors active:bg-[#bacbff1a] sm:min-h-14 sm:px-4 sm:text-[0.95rem] sm:hover:bg-[#bacbff1f]"
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            >
              Contact
            </motion.button>
          </Drawer.Trigger>
          <motion.div
            className="min-w-0 flex-[1.35]"
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            <Link
              href="/book"
              className="flex min-h-[52px] w-full items-center justify-center gap-1.5 rounded-xl bg-[#eef3ff] px-4 text-base font-semibold text-[#0b0f16] shadow-[0_0_22px_-10px_rgba(191,208,255,0.9)] sm:min-h-14 sm:px-5 sm:text-[1.05rem]"
            >
              <Sparkles
                className="size-4 shrink-0 text-[#0b0f16]/80"
                strokeWidth={2}
                aria-hidden
              />
              Book a table
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <ContactSheetPortal contact={contact} />
    </Drawer.Root>
  );
}
