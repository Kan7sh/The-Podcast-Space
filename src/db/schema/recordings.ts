import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { RoomTable } from "./room";

export const RecordingsTable = pgTable("recordings", {
  id: serial().primaryKey(),
  recordingUrl: varchar(),
  roomId: integer()
    .references((): any => RoomTable.id)
    .notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  recordingCreatedAt: timestamp({ withTimezone: true }),
  recordingLength: varchar(),
});
