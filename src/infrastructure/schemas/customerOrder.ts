import { relations } from "drizzle-orm";
import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { customerSchema } from "./customer.ts";
import { orderSchema } from "./order.ts";

export const customerOrderSchema = mysqlTable("deno_customer_order", {
  customerId: int("customer_id").notNull().references(() => customerSchema.id),
  orderId: int("order_id").notNull().references(() => orderSchema.id),
});

export const customerOrderRelations = relations(
  customerOrderSchema,
  ({ one }) => ({
    customer: one(customerSchema, {
      fields: [customerOrderSchema.customerId],
      references: [customerSchema.id],
    }),
    orderSchema: one(orderSchema, {
      fields: [customerOrderSchema.orderId],
      references: [orderSchema.id],
    }),
  }),
);

export type customerOrder = typeof customerOrderSchema.$inferSelect;
export type newCustomerOrder = typeof customerOrderSchema.$inferInsert;
export type updateCustomerOrder = Partial<
  Omit<customerOrder, "customerId" | "orderId">
>;
