import { foreignKey, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { customerSchema } from "./customer.ts";
import { relations } from "drizzle-orm";

export const addressSchema = mysqlTable("deno_addresses", {
  id: int("id").primaryKey().autoincrement(),
  customerId: int("customer_id").notNull().references(() => customerSchema.id),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  zipCode: varchar("zip_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
});

export type address = typeof addressSchema.$inferSelect;
export type newAddress = typeof addressSchema.$inferInsert;
export type updateAddress = Partial<Omit<address, "id">>;

export const AddressRelations = relations(
  addressSchema,
  ({ one }) => ({
    customer: one(customerSchema, {
      fields: [addressSchema.customerId],
      references: [customerSchema.id],
    }),
  }),
);
