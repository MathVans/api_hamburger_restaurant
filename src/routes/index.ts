import { Hono } from "@hono/hono";
import { homeController } from "../controllers/homeController.ts";

const routes = new Hono();

routes.get("/", homeController);

export default routes;
