import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  addressSchema,
  customerOrderSchema,
  customerSchema,
  orderItemSchema,
  orderSchema,
  roleAddress,
} from "../schemas/index.ts";

// Create the connection pool
const poolConnection = mysql.createPool({
  uri: Deno.env.get("DATABASE_URL")!,
});

// Create Drizzle instance
export const db = drizzle(poolConnection, {
  mode: "default",
  schema: {
    customer: customerSchema,
    Addresses: addressSchema,
    role: roleAddress,
    order: orderSchema,
    orderItem: orderItemSchema,
    customerOrder: customerOrderSchema,
  },
});
