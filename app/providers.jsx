"use client";

import { AuthProvider } from "@/contexts/auth/auth-context";
import { AuthModalProvider } from "@/contexts/auth/login-modal";
import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <AuthProvider>
        <AuthModalProvider>{children}</AuthModalProvider>
      </AuthProvider>
    </NextUIProvider>
  );
}
