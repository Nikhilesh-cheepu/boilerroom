"use client";

import { Drawer } from "vaul";
import { telHrefFromE164, type ResolvedSiteContact } from "@/lib/site-contact";
import { buildWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Bottom sheet: phone, WhatsApp, Instagram, location. Links stay in `href` only — no pasted URLs shown as text. */
export function ContactSheetPortal({
  contact,
}: {
  contact: ResolvedSiteContact;
}) {
  const chatHref = buildWhatsAppHref(
    contact.whatsappE164,
    "Hi Boiler Room — quick question:",
  );
  const telHref = telHrefFromE164(contact.phoneE164);

  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-[2px]" />
      <Drawer.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-[70] flex max-h-[88vh] flex-col rounded-t-2xl border border-white/10 bg-br-elevated outline-none",
        )}
      >
        <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-white/20" />
        <Drawer.Title className="px-6 pt-5 font-display text-xl font-semibold uppercase tracking-wide text-br-text">
          Contact
        </Drawer.Title>
        <Drawer.Description className="px-6 pt-1 text-sm text-br-muted">
          Call, WhatsApp, or Instagram — we reply fastest on WhatsApp.
        </Drawer.Description>

        <nav
          className="mt-6 flex flex-col gap-2 overflow-y-auto px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
          aria-label="Contact options"
        >
          <a
            href={telHref}
            className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-white/10 bg-br-surface px-4 py-3 text-sm font-medium text-br-text transition-colors hover:border-br-accent/35 hover:bg-br-surface-hover"
          >
            <span className="shrink-0">Phone</span>
            <span className="truncate text-right text-xs font-semibold text-br-muted sm:text-sm">
              {contact.phoneDisplay}
            </span>
          </a>
          <a
            href={chatHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-white/10 bg-br-surface px-4 py-3 text-sm font-medium text-br-text transition-colors hover:border-br-accent/35 hover:bg-br-surface-hover"
          >
            <span className="shrink-0">WhatsApp</span>
            <span className="truncate text-right text-xs font-semibold text-br-muted sm:text-sm">
              {contact.whatsappDisplay}
            </span>
          </a>
          <a
            href={contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-white/10 bg-br-surface px-4 py-3 text-sm font-medium text-br-text transition-colors hover:border-br-accent/35 hover:bg-br-surface-hover"
          >
            <span className="shrink-0">Instagram</span>
            <span className="text-right text-xs font-medium text-br-accent sm:text-sm">
              Open Instagram
            </span>
          </a>
          <a
            href={contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 flex-col items-start justify-center gap-1 rounded-xl border border-white/10 bg-br-surface px-4 py-3 text-left transition-colors hover:border-br-accent/35 hover:bg-br-surface-hover"
          >
            <span className="text-sm font-medium text-br-text">Location</span>
            <span className="text-xs leading-relaxed text-br-muted">
              {contact.addressLine}
            </span>
            <span className="text-xs font-semibold text-br-accent">
              Open in Maps
            </span>
          </a>
        </nav>
      </Drawer.Content>
    </Drawer.Portal>
  );
}
