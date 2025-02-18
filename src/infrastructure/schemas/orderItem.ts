import { decimal, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { orderSchema } from "./order.ts";

export const orderItemSchema = mysqlTable("deno_order_items", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull().references(() => orderSchema.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export type orderItem = typeof orderItemSchema.$inferSelect;
export type newOrderItem = typeof orderItemSchema.$inferInsert;
export type updateOrderItem = Partial<Omit<orderItem, "id">>;

export const orderItemRelations = relations(orderItemSchema, ({ one }) => ({
  order: one(orderSchema, {
    fields: [orderItemSchema.orderId],
    references: [orderSchema.id],
  }),
}));
