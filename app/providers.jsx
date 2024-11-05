"use client";

import { UserProvider } from "@/contexts/auth/auth-context";
import { AuthModalProvider } from "@/contexts/auth/login-modal";
import { SearchProvider } from "@/contexts/search/search-context";
import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <UserProvider>
        <AuthModalProvider>
          <SearchProvider>{children}</SearchProvider>
        </AuthModalProvider>
      </UserProvider>
    </NextUIProvider>
  );
}
