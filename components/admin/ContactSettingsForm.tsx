import { updateSiteContactAction } from "@/app/actions/cms";

export type ContactSettingsInitial = {
  contactPhoneE164: string;
  contactWhatsappE164: string;
  contactPhoneDisplay: string;
  contactWhatsappDisplay: string;
  contactInstagramUrl: string;
  contactMapsUrl: string;
  contactAddressLine: string;
  contactBookingMessage: string;
};

export function ContactSettingsForm({
  initial,
}: {
  initial: ContactSettingsInitial;
}) {
  return (
    <form
      action={updateSiteContactAction}
      className="mt-6 flex flex-col gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-200">Phone (E.164 digits)</span>
          <input
            name="contactPhoneE164"
            defaultValue={initial.contactPhoneE164}
            placeholder="9876543210 or 919876543210"
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/40 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
          />
          <span className="text-xs text-zinc-500">
            Indian 10-digit mobile is fine — we save as 91…. Used for the Call
            link.
          </span>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-200">WhatsApp (digits)</span>
          <input
            name="contactWhatsappE164"
            defaultValue={initial.contactWhatsappE164}
            placeholder="10 digits or leave blank to match phone"
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/40 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
          />
          <span className="text-xs text-zinc-500">
            Leave blank to reuse the phone number. Same 91… rule for 10 digits.
          </span>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-200">Phone label (optional)</span>
          <input
            name="contactPhoneDisplay"
            defaultValue={initial.contactPhoneDisplay}
            placeholder="+91 98765 43210"
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/40 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-200">
            WhatsApp label (optional)
          </span>
          <input
            name="contactWhatsappDisplay"
            defaultValue={initial.contactWhatsappDisplay}
            placeholder="Shown in the contact sheet"
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/40 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-200">Instagram URL</span>
        <input
          name="contactInstagramUrl"
          type="url"
          defaultValue={initial.contactInstagramUrl}
          placeholder="https://instagram.com/yourvenue"
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/40 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-200">Maps URL</span>
        <input
          name="contactMapsUrl"
          type="url"
          defaultValue={initial.contactMapsUrl}
          placeholder="Google Maps link"
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/40 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-200">Address (one line)</span>
        <input
          name="contactAddressLine"
          defaultValue={initial.contactAddressLine}
          placeholder="Street — City"
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/40 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-zinc-200">
          WhatsApp pre-filled booking message
        </span>
        <textarea
          name="contactBookingMessage"
          rows={3}
          defaultValue={initial.contactBookingMessage}
          placeholder="Hi Boiler Room — I'd like to book…"
          className="resize-y rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-teal-500/40 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
        />
        <span className="text-xs text-zinc-500">
          Used for the sticky &quot;Book a table&quot; WhatsApp link.
        </span>
      </label>

      <button
        type="submit"
        className="mt-2 inline-flex w-fit items-center justify-center rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500"
      >
        Save contact & booking
      </button>
      <p className="text-xs text-zinc-500">
        Leave any field empty to fall back to your{" "}
        <code className="text-zinc-400">NEXT_PUBLIC_*</code> values in{" "}
        <code className="text-zinc-400">.env</code>.
      </p>
    </form>
  );
}
