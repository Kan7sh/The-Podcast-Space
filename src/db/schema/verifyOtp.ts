import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { TempUserTable } from "./tempUser";

export const VerifyOTPTable = pgTable("verifyOtp", {
  id: serial().primaryKey(),
  uuid: uuid().defaultRandom(),
  email: varchar().notNull(),
  otp: varchar().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  validTill: timestamp({ withTimezone: true }),
  isVerified: boolean(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  tempUserId: integer().references((): any => TempUserTable.id),
});
