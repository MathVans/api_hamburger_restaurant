import { orderItemSchema } from "./orderItem.ts";
import { relations } from "drizzle-orm";
import {
  double,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const orderSchema = mysqlTable("deno_order", {
  id: int("id").primaryKey().autoincrement(),
  price: double("price").notNull(),
  quantity: double("quantity").notNull(),
  orderDate: timestamp("order_date").defaultNow(),
  requiredDate: timestamp("required_date").defaultNow(),
  shippedDate: timestamp("shipped_date").defaultNow(),
  status: mysqlEnum("status", ["Shipped", "Pending", "Delivered"]).default(
    "Pending",
  ),
  comments: varchar("comments", { length: 255 }),
});

export const orderRelations = relations(orderSchema, ({ many }) => ({
  items: many(orderItemSchema),
}));

export type order = typeof orderSchema.$inferSelect;
export type Neworder = typeof orderSchema.$inferInsert;
export type Updateorder = Partial<Omit<order, "id">>;
