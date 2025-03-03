import { Context, Next } from "oak";

export type ValidationSchema = {
  [key: string]: (value: any) => boolean | string;
};

export function validate(schema: ValidationSchema) {
  return async (ctx: Context, next: Next) => {
    try {
      const body = await ctx.request.body.json();
      const errors: { [key: string]: string } = {};

      for (const [field, validator] of Object.entries(schema)) {
        const result = validator(body[field]);
        if (typeof result === "string") {
          errors[field] = result;
        }
      }

      if (Object.keys(errors).length > 0) {
        ctx.response.status = 400;
        ctx.response.body = { success: false, errors };
        return;
      }

      ctx.state.validatedData = body;
      await next();
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { success: false, error: "Invalid request body" };
    }
  };
}

export const validators = {
  required: (value: any) => {
    return value !== undefined && value !== null && value !== ""
      ? true
      : "Field is required";
  },
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? true : "Invalid email format";
  },
  minLength: (length: number) => (value: string) => {
    return value.length >= length
      ? true
      : `Must be at least ${length} characters`;
  }
};