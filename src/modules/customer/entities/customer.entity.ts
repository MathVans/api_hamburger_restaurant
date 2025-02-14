import {
  decimal,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const CustomerTable = mysqlTable("deno_customers", {
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export type Customer = typeof CustomerTable.$inferSelect;
export type NewCustomer = typeof CustomerTable.$inferInsert;
export type UpdateCustomer = Partial<
  Omit<Customer, "id" | "createdAt" | "updatedAt">
>;
