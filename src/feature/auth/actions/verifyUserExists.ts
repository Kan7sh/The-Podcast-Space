"use server";
import { getUserByEmail } from "../db/auth";

export async function verifyUserExists(email: string) {
  const user = await getUserByEmail(email);
  if (user) {
    return true;
  }
  return false;
}
