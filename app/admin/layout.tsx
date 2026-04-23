export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen antialiased"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20, 184, 166, 0.12), transparent 50%), linear-gradient(180deg, #09090b 0%, #0c0c0f 40%, #050506 100%)",
      }}
    >
      {children}
    </div>
  );
}
