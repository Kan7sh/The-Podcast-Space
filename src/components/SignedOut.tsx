"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function SignedOut({ children }: { children: ReactNode }) {
  const session = useSession();

  if (session.status === "authenticated") {
    redirect("/");
  } else {
    return <div>{children}</div>;
  }
}
