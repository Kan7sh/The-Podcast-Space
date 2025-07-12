"use server";
import { db } from "@/db/db";
import { RecordingsTable } from "@/db/schema";

export async function insertRecordingsData(
  recording: typeof RecordingsTable.$inferInsert
) {
  return await db
    .insert(RecordingsTable)
    .values(recording)
    .returning({ id: RecordingsTable.id });
}
