"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { RoomProvider } from "@/store/context/RoomContext";
import { ThemeProvider } from "@/store/context/ThemeContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RoomProvider>
      <ThemeProvider>
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </RoomProvider>
  );
}
