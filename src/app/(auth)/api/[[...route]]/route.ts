import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/feature/auth/server/route";
import workspaces from "@/feature/workspaces/server/route";

const app = new Hono().basePath("/api");

const routes = app.route("/auth", auth).route("/workspaces", workspaces);

export const GET = handle(app);
export const POST = handle(routes);
export const PATCH = handle(routes);

export type AppType = typeof routes;
