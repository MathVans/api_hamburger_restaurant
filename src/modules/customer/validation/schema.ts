import { z } from "zod";

// Base schema for customer validation
const customerBaseSchema = {
  firstName: z.string().min(2).max(100),
  middleName: z.string().max(100).nullable().optional(),
  lastName: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).nullable().optional(),
  address: z.string().max(255).nullable().optional(),
  creditLimit: z.number().default(0.00).optional(),
  roleId: z.number().int().positive(),
};

// Schema for creating a new customer
export const customerCreateSchema = z.object(customerBaseSchema);

// Schema for updating an existing customer
export const customerUpdateSchema = z.object({
  ...customerBaseSchema,
}).partial();

// Address validation schema
export const addressCreateSchema = z.object({
  street: z.string().min(5).max(255),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  zipCode: z.string().min(5).max(20),
  country: z.string().min(2).max(100),
});

// Custom error messages
export const validationErrors = {
  firstName: {
    required: "First name is required",
    min: "First name must be at least 2 characters",
    max: "First name must not exceed 100 characters",
  },
  lastName: {
    required: "Last name is required",
    min: "Last name must be at least 2 characters",
    max: "Last name must not exceed 100 characters",
  },
  email: {
    required: "Email is required",
    invalid: "Invalid email format",
    max: "Email must not exceed 255 characters",
  },
  roleId: {
    required: "Role ID is required",
    invalid: "Role ID must be a positive number",
  },
};
