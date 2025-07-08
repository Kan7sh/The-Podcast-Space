"use server";

import { db } from "@/db/db";
import { UserTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email: string) {
  return await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
  });
}

export async function updateUser(
  id: string,
  user: Partial<typeof UserTable.$inferInsert>
) {
  console.log(user);
  await db
    .update(UserTable)
    .set(user)
    .where(eq(UserTable.id, Number(id)));
}
