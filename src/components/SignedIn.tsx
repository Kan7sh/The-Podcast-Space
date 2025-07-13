"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

export default function SignedIn({ children }: { children: ReactNode }) {
  const session = useSession();

  if (session.status === "loading") {
    return (
      <div className="h-screen w-screen flex items-center justify-center self-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    redirect("/login");
  } else {
    return <div>{children}</div>;
  }
}
