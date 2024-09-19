"use client";

import { UserProvider } from "@/contexts/auth/auth-context";
import { AuthModalProvider } from "@/contexts/auth/login-modal";
import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <UserProvider>
        <AuthModalProvider>{children}</AuthModalProvider>
      </UserProvider>
    </NextUIProvider>
  );
}
