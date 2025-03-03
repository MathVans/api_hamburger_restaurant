import { Hono } from "hono";
import { CustomerService } from "../services/customer.service.ts";
import { CustomerRepository } from "../repositories/customer.repository.ts";
import { useValidation } from "../../shared/hooks/useValidation.ts";
import {
  customerCreateSchema,
  customerUpdateSchema,
  loginSchema,
  toNewCustomer,
  toUpdateCustomer,
} from "../schemas/user.schema.ts";

const customerService = new CustomerService(new CustomerRepository());
const customerController = new Hono();

// CREATE - Corrigido
customerController.post("/", async (c) => {
  const validate = useValidation(customerCreateSchema, toNewCustomer);
  const [input, customerData] = await validate(c);

  // Se validação falhou, o hook já definiu a resposta
  if (!input) return;

  // Prossegue com a criação usando dados já transformados
  const customer = await customerService.createCustomer(customerData);
  return c.json({ ...customer, password: undefined }, 201);
});

// UPDATE - Corrigido
customerController.put("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) {
    return c.json({ error: "ID inválido" }, 400);
  }

  const validate = useValidation(customerUpdateSchema, toUpdateCustomer);
  const [input, updateData] = await validate(c);

  // Não retorna o contexto, retorna void (early return)
  if (!input) return;

  const customer = await customerService.updateCustomer(id, updateData);
  if (!customer) {
    return c.json({ error: "Cliente não encontrado" }, 404);
  }

  return c.json({ ...customer, password: undefined });
});
// GET ALL - Sem validação de corpo
customerController.get("/", async (c) => {
  const customers = await customerService.getAllCustomers();
  return c.json(customers);
});

// GET ONE - Com validação de parâmetros
customerController.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "ID inválido" }, 400);

  const customer = await customerService.getCustomerById(id);
  if (!customer) return c.json({ error: "Cliente não encontrado" }, 404);

  return c.json(customer);
});

// DELETE
customerController.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "ID inválido" }, 400);

  const deleted = await customerService.deleteCustomer(id);
  if (!deleted) return c.json({ error: "Cliente não encontrado" }, 404);

  return c.json({ message: "Cliente excluído com sucesso" });
});

export default customerController;
