import {
  decimal,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { relations } from "drizzle-orm";
import { orderSchema } from "./order.ts";
import { roleAddress } from "./role.ts";
import { addressSchema } from "./address.ts";

export const customerSchema = mysqlTable("deno_customers", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  middleName: varchar("middle_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  address: varchar("address", { length: 255 }),
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }).default(
    "0.00",
  ),
  roleId: int("role_id").notNull().references(() => roleAddress.id),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow()
    .onUpdateNow(),
});

export const customerRelations = relations(customerSchema, ({ many, one }) => ({
  addresses: many(addressSchema), // 1 Cliente -> Muitos Endereços
  orders: many(orderSchema), // 1 Cliente -> Muitos Pedidos (M:N)
  role: one(roleAddress, {
    fields: [customerSchema.roleId],
    references: [roleAddress.id],
  }), // 1 Cliente -> Muitos Papéis (1:M)
}));

export type customer = typeof customerSchema.$inferSelect;
export type newCustomer = typeof customerSchema.$inferInsert;
export type updateCustomer = Partial<
  Omit<customer, "id" | "createdAt" | "updatedAt">
>;
