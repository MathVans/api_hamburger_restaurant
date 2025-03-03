import {
  decimal,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { relations } from "drizzle-orm";
import { roleTable } from "./role.ts";
import { addressTable } from "./address.ts";
import { z } from "zod";

export const customerTable = mysqlTable("deno_customers", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  middleName: varchar("middle_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  roleId: int("role_id").notNull().references(() => roleTable.id),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow()
    .onUpdateNow(),
});

export const customerRelations = relations(customerTable, ({ many, one }) => ({
  addresses: many(addressTable), // 1 Cliente -> Muitos Endereços
  role: one(roleTable, {
    fields: [customerTable.roleId],
    references: [roleTable.id],
  }), // 1 Cliente -> Muitos Papéis (1:M)
}));

export type customer = typeof customerTable.$inferSelect;
export type newCustomer = typeof customerTable.$inferInsert;
export type updateCustomer = Partial<
  Omit<customer, "id" | "createdAt" | "updatedAt">
>;
