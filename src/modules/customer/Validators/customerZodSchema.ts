import { z } from "zod";

export const customerRequestSchema = z.object({
  firstName: z.string().min(1).max(100),
  middleName: z.string().max(100).optional(),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  address: z.string().max(255).optional(),
  creditLimit: z.number().default(0.00).optional(),
});

export const customerResponseSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  creditLimit: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CustomerRequest = z.infer<typeof customerRequestSchema>;
export type CustomerResponse = z.infer<typeof customerResponseSchema>;
