import { Hono } from "@hono/hono";
import { logger } from "./src/middlewares/logger.ts";
// import customerRoutes from "./src/routes/customerRoutes.ts";
// import employeeRoutes from "./src/routes/employeeRoutes.ts";
// import orderRoutes from "./src/routes/orderRoutes.ts";

const app = new Hono();

// Global middleware
app.use("*", logger);

// Routes
// app.route("/api/customers", customerRoutes);
// app.route("/api/employees", employeeRoutes);
// app.route("/api/orders", orderRoutes);

Deno.serve(app.fetch);
