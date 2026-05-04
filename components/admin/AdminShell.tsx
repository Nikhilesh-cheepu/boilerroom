"use client";

import { usePathname } from "next/navigation";
import { AdminChrome } from "./AdminChrome";
import { AdminToaster } from "./AdminToaster";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  return (
    <>
      {isLogin ? (
        children
      ) : (
        <AdminChrome>{children}</AdminChrome>
      )}
      <AdminToaster />
    </>
  );
}
