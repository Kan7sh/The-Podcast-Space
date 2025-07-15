"use server";

import { db } from "@/db/db";
import {
  RecordingsTable,
  RoomTable,
  UserRecordingsTable,
  UserTable,
} from "@/db/schema";
import { eq, desc, and, isNotNull } from "drizzle-orm";

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

export async function getUserRecordings(userId: number) {
  const result = await db
    .select({
      recordingUrl: RecordingsTable.recordingUrl,
      roomName: RoomTable.name,
      duration: RecordingsTable.recordingLength,
      createdAt: RecordingsTable.recordingCreatedAt,
      recordingId: RecordingsTable.id,
    })
    .from(UserRecordingsTable)
    .where(
      and(
        eq(UserRecordingsTable.userId, userId),
        isNotNull(RecordingsTable.recordingUrl)
      )
    )

    .innerJoin(
      RecordingsTable,
      eq(UserRecordingsTable.recordingId, RecordingsTable.id)
    )
    .innerJoin(RoomTable, eq(UserRecordingsTable.roomId, RoomTable.id))
    .orderBy(desc(RecordingsTable.recordingCreatedAt));

  return result;
}
