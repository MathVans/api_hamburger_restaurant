import { EmployeeTable } from "../../employee/entities/employee.entity.ts";
import { CustomerTable } from "../../customer/entities/customer.entity.ts";
import {
  double,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const OrderTable = mysqlTable("deno_order", {
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
  employee_id: int("employee_id").notNull().references(() => EmployeeTable.id, {
    onDelete: "cascade",
  }),
  customers_id: int("customers_id").notNull().references(
    () => CustomerTable.id,
    {
      onDelete: "cascade",
    },
  ),
});
