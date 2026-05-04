"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircleMore, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Drawer } from "vaul";
import { ContactSheetPortal } from "@/components/contact/ContactSheet";
import type { ResolvedSiteContact } from "@/lib/site-contact";
import { cn } from "@/lib/utils";

export function StickyDock({ contact }: { contact: ResolvedSiteContact }) {
  const reduceMotion = useReducedMotion() ?? false;
  const [unmuted, setUnmuted] = useState(false);

  const toggleAudio = () => {
    setUnmuted((prev) => {
      const next = !prev;
      // Never dispatch from inside a setState updater: listeners may call
      // setState on other components (FullBleedHero) while React is still
      // resolving this update → "Cannot update X while rendering Y".
      queueMicrotask(() => {
        window.dispatchEvent(
          new CustomEvent("hero-audio-set", { detail: { unmuted: next } }),
        );
      });
      return next;
    });
  };

  return (
    <Drawer.Root shouldScaleBackground={false}>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-3 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-1.5">
        <motion.div
          className={cn(
            "pointer-events-auto flex w-full max-w-md gap-1.5 rounded-2xl border border-white/15 bg-[#0a0f19]/60 p-1.5 shadow-[0_-16px_40px_-24px_rgba(0,0,0,0.85)] backdrop-blur-2xl",
          )}
          initial={reduceMotion ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        >
          <Drawer.Trigger asChild>
            <motion.button
              type="button"
              className="flex min-h-10 min-w-0 flex-1 touch-manipulation items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.03] px-3 text-[0.88rem] font-medium text-[#c8d0e8] transition-colors active:bg-white/[0.08] sm:hover:bg-white/[0.07]"
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            >
              <MessageCircleMore className="size-[15px] shrink-0 text-[#aeb7d1]" />
              Contact us
            </motion.button>
          </Drawer.Trigger>
          <motion.div
            className="relative flex-1"
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          >
            <span className="pointer-events-none absolute -top-1.5 right-2 rounded-full border border-[#ff7f9e55] bg-[#ff4d7e2e] px-1.5 py-px text-[9px] font-semibold tracking-wide text-[#ffd0de]">
              30% off
            </span>
            <Link
              href="/book"
              className="flex min-h-10 min-w-0 items-center justify-center rounded-xl bg-[#e8eefc] px-3 text-[0.92rem] font-semibold text-[#0a0f17] shadow-[0_0_22px_-12px_rgba(191,208,255,0.95)]"
            >
              Book table
            </Link>
          </motion.div>
          <motion.button
            type="button"
            onClick={toggleAudio}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c6d5ff40] bg-[#bacbff14] text-[#dce6ff] transition-colors sm:hover:bg-[#bacbff2b]",
              "border-white/15 bg-white/[0.03] text-[#aeb7d1] sm:hover:bg-white/[0.07]",
              unmuted && "border-[#cdd9fb66] bg-[#c8d7ff1c] text-[#e7edff]",
            )}
            aria-label={unmuted ? "Mute video" : "Unmute video"}
          >
            {unmuted ? (
              <Volume2 className="size-4" strokeWidth={2} />
            ) : (
              <VolumeX className="size-4" strokeWidth={2} />
            )}
          </motion.button>
        </motion.div>
      </div>

      <ContactSheetPortal contact={contact} />
    </Drawer.Root>
  );
}
