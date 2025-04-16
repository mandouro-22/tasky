import { DATABASE_ID, IMAGE_BUCKET_ID, WORKSPACES_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session_middleware";
import { CreateWorkspacesSchema } from "@/validations/workspaces/workspaces_schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const database = c.get("databases");
    const workspaces = await database.listDocuments(DATABASE_ID, WORKSPACES_ID);

    return c.json({
      status: 200,
      success: true,
      message: "get workspace successuflly",
      error: null,
      data: workspaces,
    });
  })

  .post(
    "/workspaces",
    zValidator("form", CreateWorkspacesSchema),
    sessionMiddleware,
    async (c) => {
      const database = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, imageUrl } = c.req.valid("form");

      // Check if the workspace already exists
      let uploadedImageUrl: string | undefined;

      if (imageUrl instanceof File) {
        const file = await storage.createFile(
          IMAGE_BUCKET_ID,
          ID.unique(),
          imageUrl
        );

        const arrayBuffer = await storage.getFileDownload(
          IMAGE_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const workspace = await database.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
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
