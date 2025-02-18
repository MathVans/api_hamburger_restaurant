import { relations } from "drizzle-orm";
import {
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { customerSchema } from "./customer.ts";

export const roleAddress = mysqlTable("deno_roles", {
  id: int("id").primaryKey().autoincrement(),
  name: mysqlEnum("name", ["VIP", "Common"]).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export type role = typeof roleAddress.$inferSelect;
export type newRole = typeof roleAddress.$inferInsert;
export type updateRole = Partial<Omit<role, "id">>;

export const roleRelations = relations(roleAddress, ({ many }) => ({
  customers: many(customerSchema),
}));
