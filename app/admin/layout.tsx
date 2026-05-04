import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#09090b] antialiased text-zinc-100">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -18%, rgba(14, 165, 233, 0.09), transparent 52%), radial-gradient(ellipse 70% 45% at 100% 0%, rgba(99, 102, 241, 0.06), transparent 45%), linear-gradient(180deg, #09090b 0%, #0c0c0f 45%, #050506 100%)",
        }}
      />
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
