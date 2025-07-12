"use server";
import { db } from "@/db/db";
import { RecordingsTable, RoomTable, UserRecordingsTable } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";

export async function insertRoomData(room: typeof RoomTable.$inferInsert) {
  return await db
    .insert(RoomTable)
    .values(room)
    .returning({ id: RoomTable.id });
}

export async function findActiveRoom(roomId: string) {
  return await db.query.RoomTable.findFirst({
    where: and(eq(RoomTable.roomId, roomId), eq(RoomTable.isActive, true)),
  });
}

export async function insertUserRecordingData(
  userRecording: typeof UserRecordingsTable.$inferInsert
) {
  return await db
    .insert(UserRecordingsTable)
    .values(userRecording)
    .returning({ id: UserRecordingsTable.id });
}

export async function getRecordingIdFromRoomId(roomId: number) {
  return await db.query.RecordingsTable.findFirst({
    where: and(
      eq(RecordingsTable.roomId, roomId),
      isNull(RecordingsTable.recordingUrl)
    ),
  });
}
