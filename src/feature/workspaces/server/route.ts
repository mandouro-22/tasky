import {
  DATABASE_ID,
  IMAGE_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACES_ID,
} from "@/config";
import { sessionMiddleware } from "@/lib/session_middleware";
import { Member_Role } from "@/feature/members/types/type";
import {
  CreateWorkspacesSchema,
  UpdateWorkspacesSchema,
} from "@/validations/workspaces/workspaces_schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { generateInviteCode } from "@/lib/utils";
import { getMembers } from "@/feature/members/utils";
import { uploadImageAsBase64 } from "@/lib/uploadImaqge";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const database = c.get("databases");
    const user = c.get("user");
    const members = await database.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({
        status: 200,
        success: true,
        message: "member is not found",
        error: null,
        data: { total: 0, documents: [] },
      });
    }

    const workspacesId = members.documents.map((member) => member.workspaceId);

    const workspaces = await database.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspacesId)]
    );

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

      let uploadedImageUrl: string | undefined;

      if (imageUrl instanceof File) {
        uploadedImageUrl = await uploadImageAsBase64(
          storage,
          imageUrl,
          IMAGE_BUCKET_ID
        );
      }

      const workspace = await database.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(6),
        }
      );

      await database.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: Member_Role.ADMIN,
      });

      return c.json({
        status: 200,
        error: null,
        success: true,
        message: "add workspace successfully",
        data: workspace,
      });
    }
  )

  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", UpdateWorkspacesSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { imageUrl, name } = c.req.valid("form");

      const member = await getMembers({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== Member_Role.ADMIN)
        return c.json({
          status: 401,
          error: true,
          success: false,
          message: "UnAuthorized",
          data: null,
        });

      let uploadedImageUrl: string | undefined;

      if (imageUrl instanceof File) {
        uploadedImageUrl = await uploadImageAsBase64(
          storage,
          imageUrl,
          IMAGE_BUCKET_ID
        );
      } else {
        uploadedImageUrl = imageUrl;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({
        status: 200,
        error: null,
        success: true,
        message: "Update workspace successfully",
        data: workspace,
      });
    }
  );

export default app;
