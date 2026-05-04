"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Volume2, VolumeX } from "lucide-react";
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
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
        <div className="pointer-events-auto mb-2 rounded-full border border-emerald-400/25 bg-emerald-950/50 px-3 py-1.5 shadow-sm backdrop-blur-md">
          <p className="text-center text-[11px] font-semibold leading-tight tracking-wide text-emerald-100 sm:text-xs">
            30% off · Book this week
          </p>
        </div>

        <motion.div
          className={cn(
            "pointer-events-auto flex w-full max-w-md gap-2 rounded-2xl border border-white/[0.08] bg-zinc-950/55 p-2 shadow-[0_-8px_32px_-16px_rgba(0,0,0,0.6)] backdrop-blur-xl",
          )}
          initial={reduceMotion ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
        >
          <Drawer.Trigger asChild>
            <motion.button
              type="button"
              className="flex min-h-11 min-w-0 flex-1 touch-manipulation items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 text-[0.875rem] font-medium text-zinc-200 transition-colors active:bg-white/[0.07] sm:hover:bg-white/[0.06]"
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <MessageCircle className="size-[17px] shrink-0 text-zinc-400" strokeWidth={1.75} />
              Contact
            </motion.button>
          </Drawer.Trigger>

          <motion.div className="relative min-w-0 flex-1" whileTap={reduceMotion ? undefined : { scale: 0.99 }}>
            <Link
              href="/book"
              className="flex min-h-11 w-full items-center justify-center rounded-xl bg-zinc-100 px-3 text-[0.9rem] font-semibold text-zinc-950 transition-colors active:bg-zinc-200/90 sm:hover:bg-white"
            >
              Book table
            </Link>
          </motion.div>

          <motion.button
            type="button"
            onClick={toggleAudio}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-zinc-400 transition-colors active:bg-white/[0.07] sm:hover:bg-white/[0.06] sm:hover:text-zinc-200",
              unmuted && "border-white/12 bg-white/[0.08] text-zinc-100",
            )}
            aria-label={unmuted ? "Mute video" : "Unmute video"}
          >
            {unmuted ? (
              <Volume2 className="size-[18px]" strokeWidth={1.75} />
            ) : (
              <VolumeX className="size-[18px]" strokeWidth={1.75} />
            )}
          </motion.button>
        </motion.div>
      </div>

      <ContactSheetPortal contact={contact} />
    </Drawer.Root>
  );
}
