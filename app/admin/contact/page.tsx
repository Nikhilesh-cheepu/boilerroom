import { ContactSettingsSection } from "@/components/admin/ContactSettingsSection";
import { prisma } from "@/lib/prisma";

export default async function AdminContactPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 border-b border-white/[0.08] pb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Contact
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Phone, WhatsApp, Instagram, maps, and the sticky booking message.
        </p>
      </header>

      <ContactSettingsSection s={s} className="mt-0" />
    </div>
  );
}
