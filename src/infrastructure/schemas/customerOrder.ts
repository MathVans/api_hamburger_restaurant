import { relations } from "drizzle-orm";
import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { customerTable } from "./customer.ts";
import { orderTable } from "./order.ts";

export const customerOrderTable = mysqlTable("deno_customer_order", {
  customerId: int("customer_id").notNull().references(() => customerTable.id),
  orderId: int("order_id").notNull().references(() => orderTable.id),
});

export const customerOrderRelations = relations(
  customerOrderTable,
  ({ one }) => ({
    customer: one(customerTable, {
      fields: [customerOrderTable.customerId],
      references: [customerTable.id],
    }),
    orderTable: one(orderTable, {
      fields: [customerOrderTable.orderId],
      references: [orderTable.id],
    }),
  }),
);

export type customerOrder = typeof customerOrderTable.$inferSelect;
export type newCustomerOrder = typeof customerOrderTable.$inferInsert;
export type updateCustomerOrder = Partial<
  Omit<customerOrder, "customerId" | "orderId">
>;
