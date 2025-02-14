import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { CustomerTable } from "../../modules/customer/entities/customer.entity.ts";
import { EmployeeTable } from "../../modules/employee/entities/employee.entity.ts";
import { OrderTable } from "../../modules/order/entities/order.entity.ts";

// Create the connection pool
const poolConnection = mysql.createPool({
  uri: Deno.env.get("DATABASE_URL")!,
});

// Create Drizzle instance
export const db = drizzle(poolConnection, {
  mode: "default",
  schema: {
    customers: CustomerTable,
    employees: EmployeeTable,
    orders: OrderTable,
  },
});
