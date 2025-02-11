import { Context } from "@hono/hono";

export const homeController = (c: Context) =>
  c.text("Welcome to the Hono App!");


