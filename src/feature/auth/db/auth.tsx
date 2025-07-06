"use server";

import { db } from "@/db/db";
import { TempUserTable, UserTable } from "@/db/schema";
import { hashPassword } from "@/lib/hashPassword";
import { and, eq } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  return db.query.UserTable.findFirst({
    where: eq(UserTable.email, email.trim()),
  });
}

export async function addTempUser(user: typeof TempUserTable.$inferInsert) {
  user.password = await hashPassword(user.password);
  const something = await db
    .insert(TempUserTable)
    .values(user)
    .onConflictDoNothing()
    .returning({ id: TempUserTable.id });
  return something[0]?.id;
}

export async function getTempUserById(id: number) {
  return await db.query.TempUserTable.findFirst({
    where: and(eq(TempUserTable.id, id)),
  });
}

export async function insertUser(user: typeof UserTable.$inferInsert) {
   await db.insert(UserTable).values(user);
}
