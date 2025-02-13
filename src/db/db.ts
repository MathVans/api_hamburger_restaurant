import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Create the connection pool
const poolConnection = mysql.createPool({
  uri: Deno.env.get("DATABASE_URL")!,
});

// Create Drizzle instance
export const db = drizzle(poolConnection);
