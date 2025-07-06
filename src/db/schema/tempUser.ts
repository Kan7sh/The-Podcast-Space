import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const TempUserTable = pgTable("tempUser", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  email: varchar().notNull(),
  imageUrl: varchar(),
  password: varchar().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  verfiedAt: timestamp({ withTimezone: true }),
  isVerified: boolean(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
