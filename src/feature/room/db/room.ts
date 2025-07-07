"use server";
import { db } from "@/db/db";
import { RoomTable } from "@/db/schema";

export async function insertRoomData(room: typeof RoomTable.$inferInsert) {
  await db.insert(RoomTable).values(room);
}
