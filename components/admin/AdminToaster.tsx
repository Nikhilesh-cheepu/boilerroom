"use client";

import { Toaster } from "sonner";

export function AdminToaster() {
  return (
    <Toaster
      theme="dark"
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "border border-white/10 bg-zinc-950/95 text-zinc-100 shadow-xl backdrop-blur-md",
        },
      }}
    />
  );
}
