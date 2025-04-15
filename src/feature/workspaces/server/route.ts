import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session_middleware";
import { CreateWorkspacesSchema } from "@/validations/workspaces/workspaces_schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";

const app = new Hono().post(
  "/workspaces",
  zValidator("json", CreateWorkspacesSchema),
  sessionMiddleware,
  async (c) => {
    const database = c.get("databases");
    const user = c.get("user");

    const { name } = c.req.valid("json");

    const workspace = await database.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
      }
    );

    return c.json({
      status: 200,
      error: null,
      success: true,
      message: "add workspace successfully",
      data: workspace,
    });
  }
);

export default app;
