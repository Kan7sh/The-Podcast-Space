"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function SignedIn({ children }: { children: ReactNode }) {
  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect("/login");
  } else {
    return <div>{children}</div>;
  }
}
