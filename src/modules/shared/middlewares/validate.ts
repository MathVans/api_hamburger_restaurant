// src/modules/shared/middlewares/validate.ts
import { Context, MiddlewareHandler, Next } from "hono";
import { z } from "zod";

/**
 * Middleware para validar dados de requisição usando Zod
 * @param schema Schema Zod para validação
 * @param target Onde procurar os dados ('json', 'form', 'query')
 */
export function validate<T extends z.ZodType>(
  schema: T,
  target: "json" | "form" | "query" = "json"
): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    try {
      // Obter dados da fonte apropriada
      let data;
      if (target === "json") {
        data = await c.req.json();
      } else if (target === "form") {
        data = await c.req.formData();
      } else if (target === "query") {
        data = Object.fromEntries(new URL(c.req.url).searchParams);
      }

      // Validar dados
      const result = schema.safeParse(data);

      if (!result.success) {
        return c.json({
          success: false,
          errors: result.error.format(),
        }, 400);
      }

      // Adicionar dados validados ao contexto
      c.set("data", result.data);
      await next();
    } catch (error) {
      return c.json({
        success: false,
        message: "Invalid request format",
      }, 400);
    }
  };
}

/**
 * Middleware para validar parâmetros de URL
 */
export function validateParams<T extends z.ZodType>(schema: T): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    const params = c.req.param();
    const result = schema.safeParse(params);
    
    if (!result.success) {
      return c.json({
        success: false,
        errors: result.error.format(),
      }, 400);
    }

    c.set("params", result.data);
    await next();
  };
}