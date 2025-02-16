import { foreignKey, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { customer } from "./customer.ts";
import { relations } from "drizzle-orm";

export const address = mysqlTable("deno_addresses", {
  id: int("id").primaryKey().autoincrement(),
  customerId: int("customer_id").notNull().references(() => customer.id),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
});

export type address = typeof address.$inferSelect;
export type newAddress = typeof address.$inferInsert;
export type updateAddress = Partial<Omit<address, "id">>;

export const AddressRelations = relations(
  address,
  ({ one }) => ({
    customer: one(customer, {
      fields: [address.customerId],
      references: [customer.id],
    }),
  }),
);
