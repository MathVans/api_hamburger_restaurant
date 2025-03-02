import { decimal, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { orderTable } from "./order.ts";

export const orderItemTable = mysqlTable("deno_order_items", {
  id: int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull().references(() => orderTable.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const orderItemRelations = relations(orderItemTable, ({ one }) => ({
  order: one(orderTable, {
    fields: [orderItemTable.orderId],
    references: [orderTable.id],
  }),
}));

export type orderItem = typeof orderItemTable.$inferSelect;
export type newOrderItem = typeof orderItemTable.$inferInsert;
export type updateOrderItem = Partial<Omit<orderItem, "id">>;
