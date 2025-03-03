import { Hono } from "npm:hono";

const app = new Hono();

Deno.serve(app.fetch);
