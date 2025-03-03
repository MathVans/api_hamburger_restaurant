import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  addressTable,
  customerOrderTable,
  customerTable,
  orderItemTable,
  orderTable,
  roleTable,
} from "../models/index.ts";

// Create the connection pool
const poolConnection = mysql.createPool({
  uri: Deno.env.get("DATABASE_URL")!,
});

// Create Drizzle instance
export const db = drizzle(poolConnection, {
  mode: "default",
  schema: {
    customer: customerTable,
    Addresses: addressTable,
    role: roleTable,
    order: orderTable,
    orderItem: orderItemTable,
    customerOrder: customerOrderTable,
  },
});
