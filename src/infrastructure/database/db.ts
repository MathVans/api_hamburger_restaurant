import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { customer } from "../schemas/customer.ts";
import { address } from "../schemas/address.ts";
import { role } from "../schemas/role.ts";
import { order } from "../schemas/order.ts";
import { orderItem } from "../schemas/orderItem.ts";

// Create the connection pool
const poolConnection = mysql.createPool({
  uri: Deno.env.get("DATABASE_URL")!,
});

// Create Drizzle instance
export const db = drizzle(poolConnection, {
  mode: "default",
  schema: {
    customer: Customer,
    Addresse: Address,
    role: role,
    order: OrderTable,
    orderItem: OrderItemTable,
  },
});
