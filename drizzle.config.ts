import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schemas/*",
  dialect: "mysql",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL")!,
  },
});
