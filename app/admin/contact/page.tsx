import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { ContactSettingsSection } from "@/components/admin/ContactSettingsSection";
import { prisma } from "@/lib/prisma";

export default async function AdminContactPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            ← Admin home
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold uppercase tracking-wide text-white sm:text-3xl">
            Contact &amp; booking
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Phone, WhatsApp, Instagram, maps, and the booking WhatsApp message.
          </p>
        </div>
      </div>
      <AdminNav />

      <ContactSettingsSection s={s} className="mt-10" />
    </div>
  );
}
