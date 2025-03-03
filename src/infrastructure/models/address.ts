import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { customerTable } from "./customer.ts";
import { relations } from "drizzle-orm";

export const addressTable = mysqlTable("deno_addresses", {
  id: int("id").primaryKey().autoincrement(),
  customerId: int("customer_id").notNull().references(() => customerTable.id),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
});

export const AddressRelations = relations(
  addressTable,
  ({ one }) => ({
    customer: one(customerTable, {
      fields: [addressTable.customerId],
      references: [customerTable.id],
    }),
  }),
);

export type address = typeof addressTable.$inferSelect;
export type newAddress = typeof addressTable.$inferInsert;
export type updateAddress = Partial<Omit<address, "id">>;
