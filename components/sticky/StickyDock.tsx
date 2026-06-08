"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, MessageCircle, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Drawer } from "vaul";
import { ContactSheetPortal } from "@/components/contact/ContactSheet";
import type { ResolvedSiteContact } from "@/lib/site-contact";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function StickyDock({
  contact,
  promoLines,
}: {
  contact: ResolvedSiteContact;
  /** From venue offers only; empty array hides the promo pill */
  promoLines?: string[];
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const [unmuted, setUnmuted] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const lines = useMemo(
    () => (promoLines ?? []).map((line) => line.trim()).filter(Boolean),
    [promoLines],
  );

  useEffect(() => {
    setPromoIndex(0);
  }, [lines.length]);

  useEffect(() => {
    if (lines.length <= 1) return;
    const id = window.setInterval(() => {
      setPromoIndex((i) => (i + 1) % lines.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [lines.length]);

  const bookEventWhatsAppHref = useMemo(
    () =>
      buildWhatsAppHref(
        contact.whatsappE164,
        "Hi — I'd like to book an event at Boiler Room.",
      ),
    [contact.whatsappE164],
  );

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
        {lines.length > 0 ? (
          <div className="pointer-events-auto mb-2 rounded-full border border-emerald-400/25 bg-emerald-950/50 px-3 py-1.5 shadow-sm backdrop-blur-md">
            <p
              key={`${promoIndex}-${lines[promoIndex]}`}
              className="text-center text-[11px] font-semibold leading-tight tracking-wide text-emerald-100 sm:text-xs"
            >
              {lines[promoIndex]}
            </p>
          </div>
        ) : null}

        <motion.div
          className={cn(
            "pointer-events-auto flex w-full max-w-[28rem] items-stretch gap-1 rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-900/85 to-[#050508]/92 p-1.5 shadow-[0_-12px_40px_-14px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:gap-1.5 sm:p-2",
          )}
          initial={false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
        >
          <Drawer.Trigger asChild>
            <motion.button
              type="button"
              className="flex min-h-11 min-w-0 flex-1 basis-0 touch-manipulation items-center justify-center gap-1 rounded-xl border border-indigo-400/35 bg-gradient-to-b from-indigo-500/25 via-indigo-950/55 to-[#0c1020]/90 px-1.5 text-[11px] font-semibold leading-tight text-indigo-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors active:bg-indigo-950/70 sm:gap-1.5 sm:px-2.5 sm:text-[0.8rem]"
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <MessageCircle className="size-[15px] shrink-0 text-sky-200/95 sm:size-[17px]" strokeWidth={2} />
              <span className="truncate">
                Contact
              </span>
            </motion.button>
          </Drawer.Trigger>

          <motion.div
            className="relative min-h-11 min-w-0 flex-1 basis-0"
            whileTap={reduceMotion ? undefined : { scale: 0.99 }}
          >
            <Link
              href="/book"
              className="flex h-full min-h-11 w-full items-center justify-center gap-1 rounded-xl border border-amber-500/55 bg-gradient-to-b from-[#fff5e0] via-[#e8cfa8] to-[#cfa76a] px-1.5 text-[11px] font-bold leading-tight text-[#1a140d] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition-colors active:brightness-95 sm:gap-1.5 sm:px-2.5 sm:text-[0.8rem]"
            >
              <span className="truncate">Book table</span>
            </Link>
          </motion.div>

          <motion.a
            href={bookEventWhatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 min-w-0 flex-1 basis-0 items-center justify-center gap-1 rounded-xl border border-fuchsia-400/35 bg-gradient-to-br from-[#a855f7]/95 via-[#7c3aed] to-[#5b21b6] px-1.5 text-[11px] font-bold leading-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition-[filter] active:brightness-95 sm:gap-1.5 sm:px-2.5 sm:text-[0.8rem]"
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            <CalendarDays className="size-[15px] shrink-0 text-violet-100 sm:size-[17px]" strokeWidth={2} />
            <span className="truncate tracking-tight">Book event</span>
          </motion.a>

          <motion.button
            type="button"
            onClick={toggleAudio}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/35 bg-gradient-to-b from-emerald-500/25 to-emerald-950/40 text-emerald-100/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-colors active:bg-emerald-950/55",
              unmuted &&
                "border-cyan-400/45 bg-gradient-to-b from-cyan-500/30 to-cyan-950/45 text-cyan-50",
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
