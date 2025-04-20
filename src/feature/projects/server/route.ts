import { DATABASE_ID, IMAGE_BUCKET_ID, PROJECTS_ID } from "@/config";
import { getMembers } from "@/feature/members/utils";
import { sessionMiddleware } from "@/lib/session_middleware";
import { uploadImageAsBase64 } from "@/lib/uploadImaqge";
import { CreateProjectSchema } from "@/validations/projects/project-schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";

const Projects = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", CreateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, imageUrl, workspaceId } = c.req.valid("form");

      const member = await getMembers({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({
          status: 401,
          success: false,
          error: true,
          message: "UnAuthorized",
          data: null,
        });
      }

      let uploadedImageUrl: string | undefined;

      if (imageUrl instanceof File) {
        uploadedImageUrl = await uploadImageAsBase64(
          storage,
          imageUrl,
          IMAGE_BUCKET_ID
        );
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
        }
      );

      return c.json({
        status: 200,
        error: null,
        success: true,
        message: "Add Project Successfully",
        data: project,
      });
    }
  )
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      /** GET_PROJECTS 👍🏻 **/

      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId } = c.req.valid("query");

      if (!workspaceId)
        return c.json({
          status: 400,
          success: false,
          error: true,
          message: "Missing workspaceId",
          data: null,
        });

      const member = await getMembers({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({
          status: 403,
          success: false,
          error: true,
          message: "UnAuthorized",
          data: null,
        });
      }

      const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);

      return c.json({
        status: 200,
        success: true,
        error: false,
        message: "Get Prjects Successfully",
        data: projects,
      });
    }
  );

export default Projects;
