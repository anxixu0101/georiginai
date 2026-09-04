import {
  mysqlTable,
  serial,
  varchar,
  timestamp,
} from "drizzle-orm/mysql-core";

export const subscriptions = mysqlTable("subscriptions", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  source: varchar("source", { length: 64 }).notNull().default("website"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Subscription = typeof subscriptions.$inferSelect;
