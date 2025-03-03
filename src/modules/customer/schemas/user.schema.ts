// src/modules/customer/schemas/customer.schema.ts
import { z } from "zod";
import type {
  newCustomer,
  updateCustomer,
} from "../../../infrastructure/models/index.ts";
import { hashPassword } from "../../shared/utils/password.ts";

// ======= 1. SCHEMAS DE VALIDAÇÃO =======
export const customerBaseSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(100),
  middleName: z.string().max(100).nullable().optional(),
  lastName: z.string().min(2, "Sobrenome deve ter no mínimo 2 caracteres").max(
    100,
  ),
  email: z.string().email("Email inválido").max(255),
  phone: z.string().max(20).nullable().optional(),
  roleId: z.number().int().positive(),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const customerCreateSchema = customerBaseSchema.extend({
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const customerUpdateSchema = customerBaseSchema.extend({
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
    .optional(),
}).partial();

// ======= 2. TYPES DERIVADOS DOS SCHEMAS =======
export type LoginInput = z.infer<typeof loginSchema>;
export type CustomerCreateInput = z.infer<typeof customerCreateSchema>;
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>;

// ======= 3. FUNÇÕES HELPERS DE TRANSFORMAÇÃO =======
/**
 * Converte input validado para formato compatível com o ORM
 */
export async function toNewCustomer(
  input: CustomerCreateInput,
): Promise<newCustomer> {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    middleName: input.middleName,
    email: input.email,
    password: await hashPassword(input.password), // Hash automaticamente
    phone: input.phone,
    roleId: input.roleId,
  };
}

/**
 * Converte input de atualização para formato compatível com o ORM
 */
export async function toUpdateCustomer(
  input: CustomerUpdateInput,
): Promise<updateCustomer> {
  // Cria objeto base sem a senha
  const updateData: updateCustomer = {
    firstName: input.firstName,
    lastName: input.lastName,
    middleName: input.middleName,
    email: input.email,
    phone: input.phone,
    roleId: input.roleId,
  };

  // Adiciona senha hasheada apenas se fornecida
  if (input.password) {
    updateData.password = await hashPassword(input.password);
  }

  return updateData;
}
