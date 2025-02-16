import { relations } from "drizzle-orm";
import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { customer } from "./customer.ts";
import { order } from "./order.ts";

export const customerOrder = mysqlTable("deno_customer_order", {
  customerId: int("customer_id").notNull().references(() => customer.id),
  orderId: int("order_id").notNull().references(() => order.id),
});

export const customerOrderRelations = relations(customerOrder, ({ one }) => ({
  customer: one(customer, {
    fields: [customerOrder.customerId],
    references: [customer.id],
  }),
  order: one(order, {
    fields: [customerOrder.orderId],
    references: [order.id],
  }),
}));

export type customerOrder = typeof customerOrder.$inferSelect;
export type newCustomerOrder = typeof customerOrder.$inferInsert;
