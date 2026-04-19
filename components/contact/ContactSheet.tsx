"use client";

import { Drawer } from "vaul";
import { getPublicEnv } from "@/lib/env";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Bottom sheet body: Call, WhatsApp, Instagram, Location (maps + address). */
export function ContactSheetPortal() {
  const env = getPublicEnv();
  const chatHref = buildWhatsAppHref(
    env.phoneE164,
    "Hi Boiler Room — quick question:",
  );
  const telHref = `tel:${env.phoneE164}`;

  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px]" />
      <Drawer.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col rounded-t-2xl border border-white/10 bg-br-elevated outline-none",
        )}
      >
        <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-white/20" />
        <Drawer.Title className="px-6 pt-5 font-display text-xl font-semibold uppercase tracking-wide text-br-text">
          Contact
        </Drawer.Title>
        <Drawer.Description className="px-6 pt-1 text-sm text-br-muted">
          Call, WhatsApp, or find us — we reply fastest on WhatsApp.
        </Drawer.Description>

        <nav
          className="mt-6 flex flex-col gap-2 overflow-y-auto px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
          aria-label="Contact options"
        >
          <a
            href={telHref}
            className="flex min-h-14 items-center justify-between rounded-xl border border-white/10 bg-br-surface px-4 text-sm font-medium text-br-text transition-colors hover:border-white/20"
          >
            Call
            <span className="text-br-muted">Phone</span>
          </a>
          <a
            href={chatHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 items-center justify-between rounded-xl border border-white/10 bg-br-surface px-4 text-sm font-medium text-br-text transition-colors hover:border-white/20"
          >
            WhatsApp
            <span className="text-br-muted">Message</span>
          </a>
          <a
            href={env.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 items-center justify-between rounded-xl border border-white/10 bg-br-surface px-4 text-sm font-medium text-br-text transition-colors hover:border-white/20"
          >
            Instagram
            <span className="text-br-muted">@</span>
          </a>
          <a
            href={env.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 flex-col items-start justify-center gap-1 rounded-xl border border-white/10 bg-br-surface px-4 py-3 text-left transition-colors hover:border-white/20"
          >
            <span className="text-sm font-medium text-br-text">Location</span>
            <span className="text-xs leading-relaxed text-br-muted">
              {env.addressLine}
            </span>
            <span className="text-xs font-semibold text-br-accent">Open in Maps</span>
          </a>
        </nav>
      </Drawer.Content>
    </Drawer.Portal>
  );
}
