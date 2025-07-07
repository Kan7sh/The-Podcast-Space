import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const RoomTable = pgTable("room", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  hostId: integer().notNull(),
  roomId: varchar().notNull(),
  numberOfAllowedParticipants: integer().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
