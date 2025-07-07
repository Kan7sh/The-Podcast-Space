"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { RoomProvider } from "@/store/context/RoomContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RoomProvider>
      <SessionProvider>{children}</SessionProvider>
    </RoomProvider>
  );
}
