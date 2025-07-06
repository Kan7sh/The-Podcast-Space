import {
  pgTable,
  serial,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const authTypes = ["credentials", "google"] as const;
export type authType = (typeof authTypes)[number];
export const authTypeEnum = pgEnum("auth_type_enums", authTypes);

export const UserTable = pgTable("user", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  email: varchar().notNull().unique(),
  imageUrl: varchar(),
  password: varchar(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  authType: authTypeEnum().notNull(),
  googleId: varchar(),
});
