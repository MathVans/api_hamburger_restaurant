import { relations } from "drizzle-orm";
import { int, mysqlEnum, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { customerTable } from "./customer.ts";

export const roleTable = mysqlTable("deno_roles", {
  id: int("id").primaryKey().autoincrement(),
  name: mysqlEnum("name", ["VIP", "Common"]).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const roleRelations = relations(roleTable, ({ many }) => ({
  customers: many(customerTable),
}));

export type role = typeof roleTable.$inferSelect;
export type newRole = typeof roleTable.$inferInsert;
export type updateRole = Partial<Omit<role, "id">>;
