import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/modules/**/entities/*.entity.ts",
  dialect: "mysql",
  dbCredentials: {
    url: Deno.env.get("DATABASE_URL")!,
  },
});
