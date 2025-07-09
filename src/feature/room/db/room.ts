"use server";
import { db } from "@/db/db";
import { RoomTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function insertRoomData(room: typeof RoomTable.$inferInsert) {
  await db.insert(RoomTable).values(room);
}

export async function findActiveRoom(roomId: string) {
  return await db.query.RoomTable.findFirst({
    where: and(eq(RoomTable.roomId, roomId), eq(RoomTable.isActive, true)),
  });

}
