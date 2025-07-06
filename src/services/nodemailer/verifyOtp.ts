"use server";

import { db } from "@/db/db";
import { VerifyOTPTable } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";

export async function verifyEmailOtp(id: number, email: string, otp: string) {
  const currentDateTime = new Date();
  const verifyOtp = await db.query.VerifyOTPTable.findFirst({
    where: and(
      eq(VerifyOTPTable.tempUserId, id),
      eq(VerifyOTPTable.email, email),
      eq(VerifyOTPTable.otp, otp),
      gt(VerifyOTPTable.validTill, currentDateTime)
    ),
  });
  if (verifyOtp) {
    return true;
  }

  return false;
}
