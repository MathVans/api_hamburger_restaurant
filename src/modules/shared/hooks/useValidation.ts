// src/modules/shared/hooks/useValidation.ts
import { Context } from "hono";
import { z } from "zod";

export interface ValidationResult<T, R = any> {
  success: boolean;
  data?: T;
  transformed?: R;
  errors?: z.ZodFormattedError<T>;
}

export function useValidation<T extends z.ZodType>(
  schema: T,
  transform?: (input: z.infer<T>) => Promise<any> | any,
) {
  return async (c: Context): Promise<ValidationResult<z.infer<T>>> => {
    try {
      const body = await c.req.json();
      const result = schema.safeParse(body);

      if (!result.success) {
        // Return errors but don't set response
        return {
          success: false,
          errors: result.error.format(),
        };
      }

      if (transform) {
        const transformed = await transform(result.data);
        return {
          success: true,
          data: result.data,
          transformed,
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      // Create a proper Zod error
      const zodError = new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          path: [],
          message: "Invalid request body format",
        },
      ]);

      return {
        success: false,
        errors: zodError.format(),
      };
    }
  };
}
