import { Hono } from "hono";
import { CustomerService } from "../services/customer.service.ts";
import { CustomerRepository } from "../repositories/customer.repository.ts";
import { zValidator } from "@hono/zod-validator";
import {
  addressCreateSchema,
  customerCreateSchema,
  customerUpdateSchema,
} from "../validation/schema.ts";

const customerController = new Hono();
const customerService = new CustomerService(new CustomerRepository());

customerController.get("/", async (c) => {
  const customers = await customerService.getAllCustomers();
  return c.json(customers);
});

customerController.get("/:id", async (c) => {
  const id = parseInt(c.param("id"));
  const customer = await customerService.getCustomerById(id);

  if (!customer) {
    return c.json({ message: "Customer not found" }, 404);
  }

  return c.json(customer);
});

customerController.post(
  "/",
  zValidator("json", customerCreateSchema),
  async (c) => {
    const data = c.req.valid("json");
    const customer = await customerService.createCustomer(data);
    return c.json(customer, 201);
  },
);

customerController.put(
  "/:id",
  zValidator("json", customerUpdateSchema),
  async (c) => {
    const id = parseInt(c.param("id"));
    const data = c.req.valid("json");

    const customer = await customerService.updateCustomer(id, data);
    if (!customer) {
      return c.json({ message: "Customer not found" }, 404);
    }

    return c.json(customer);
  },
);

customerController.delete("/:id", async (c) => {
  const id = parseInt(c.param("id"));
  const result = await customerService.deleteCustomer(id);
  return c.json({ success: result });
});

// Address endpoints
customerController.post(
  "/:id/addresses",
  zValidator("json", addressCreateSchema),
  async (c) => {
    const customerId = parseInt(c.param("id"));
    const addressData = await c.req.json();

    const address = await customerService.addCustomerAddress(
      customerId,
      addressData,
    );
    return c.json(address, 201);
  },
);

customerController.get("/:id/details", async (c) => {
  const customerId = parseInt(c.param("id"));
  const details = await customerService.getCustomerWithDetails(customerId);

  if (!details) {
    return c.json({ message: "Customer not found" }, 404);
  }

  return c.json(details);
});

customerController.get("/:id/profile", async (c) => {
  const customerId = parseInt(c.param("id"));
  const profile = await customerService.getCustomerProfileWithStats(customerId);

  if (!profile) {
    return c.json({ message: "Customer not found" }, 404);
  }

  return c.json(profile);
});

export default customerController;
