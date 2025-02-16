import { decimal, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { order } from "./order.ts";

export const orderItem = mysqlTable("deno_order_items", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull().references(() => order.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),
}));
