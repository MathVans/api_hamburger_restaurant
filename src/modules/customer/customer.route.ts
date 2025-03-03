import { Hono } from "hono";
import { authMiddleware } from "../shared/middlewares/auth.ts";
import customerController from "./controllers/customer.controller.ts";

const router = new Hono();

// Public routes
router.post("/login", customerController.login);
router.post("/register", customerController.register);

// Protected routes
router.use("/*", authMiddleware);
router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

export default router;
