import { relations } from "drizzle-orm";
import {
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { customer } from "./customer.ts";

export const role = mysqlTable("deno_roles", {
  id: int("id").primaryKey().autoincrement(),
  name: mysqlEnum("name", ["VIP", "Common"]).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export type role = typeof role.$inferSelect;
export type newRole = typeof role.$inferInsert;
export type updateRole = Partial<Omit<role, "id">>;

export const roleRelations = relations(role, ({ many }) => ({
  customers: many(customer),
}));
