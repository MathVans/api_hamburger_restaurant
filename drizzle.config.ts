import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/infrastructure/migrations/",
  schema: "./src/infrastructure/schemas/*.ts",
  dialect: "mysql",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL")!,
  },
});
