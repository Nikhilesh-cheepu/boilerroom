import type { SiteSettings } from "@prisma/client";
import {
  ContactSettingsForm,
  type ContactSettingsInitial,
} from "./ContactSettingsForm";

function toInitial(s: SiteSettings | null): ContactSettingsInitial {
  return {
    contactPhoneE164: s?.contactPhoneE164 ?? "",
    contactWhatsappE164: s?.contactWhatsappE164 ?? "",
    contactPhoneDisplay: s?.contactPhoneDisplay ?? "",
    contactWhatsappDisplay: s?.contactWhatsappDisplay ?? "",
    contactInstagramUrl: s?.contactInstagramUrl ?? "",
    contactMapsUrl: s?.contactMapsUrl ?? "",
    contactAddressLine: s?.contactAddressLine ?? "",
    contactBookingMessage: s?.contactBookingMessage ?? "",
  };
}

/** Phone, WhatsApp, Instagram, maps — sticky bar + bottom contact sheet. */
export function ContactSettingsSection({
  s,
  className = "mt-10",
}: {
  s: SiteSettings | null;
  className?: string;
}) {
  return (
    <section
      id="contact-booking"
      className={`overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/40 to-transparent p-6 shadow-xl shadow-black/20 sm:p-8 ${className}`}
    >
      <h2 className="text-lg font-semibold text-white">Contact &amp; booking</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Sticky &quot;Book a table&quot; and the contact sheet (phone, WhatsApp,
        Instagram, location). Saved in the database; leave a field empty to use
        your <code className="text-zinc-300">NEXT_PUBLIC_*</code> env defaults.
      </p>
      <ContactSettingsForm
        key={s?.updatedAt?.toISOString() ?? "no-settings"}
        initial={toInitial(s)}
      />
    </section>
  );
}
