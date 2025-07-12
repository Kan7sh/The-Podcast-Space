import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { RoomTable } from "./room";
import { UserTable } from "./user";
import { RecordingsTable } from "./recordings";

export const UserRecordingsTable = pgTable("user_recordings", {
  id: serial().primaryKey(),
  userId: integer()
    .references((): any => UserTable.id)
    .notNull(),
  roomId: integer()
    .references((): any => RoomTable.id)
    .notNull(),
  recordingId: integer().references((): any => RecordingsTable.id).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
