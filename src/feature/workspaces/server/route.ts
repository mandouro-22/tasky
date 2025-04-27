import {
  DATABASE_ID,
  IMAGE_BUCKET_ID,
  MEMBERS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { sessionMiddleware } from "@/lib/session_middleware";
import { Member_Role } from "@/feature/members/types/type";
import {
  CreateWorkspacesSchema,
  UpdateWorkspacesSchema,
} from "@/validations/workspaces/workspaces_schema";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { generateInviteCode } from "@/lib/utils";
import { getMembers } from "@/feature/members/utils";
import { uploadImageAsBase64 } from "@/lib/uploadImaqge";
import { z } from "zod";
import { Workspace } from "../type";
import { TasksStatus } from "@/feature/tasks/type";

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

    return c.json(
      {
        success: true,
        message: "get workspace successuflly",
        error: null,
        data: workspaces,
      },
      200
    );
  })

  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    const member = await getMembers({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json(
        {
          success: false,
          error: true,
          message: "UnAuthorized",
          data: null,
        },
        403
      );
    }

    return c.json(
      {
        success: true,
        error: false,
        message: "Get Workspace Successfully",
        data: workspace,
      },
      200
    );
  })

  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const databases = c.get("databases");

    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return c.json(
      {
        success: true,
        error: false,
        message: "Get Workspace Successfully",
        data: {
          $id: workspace.$id,
          name: workspace.name,
          imageUrl: workspace.imageUrl,
        },
      },
      200
    );
  })

  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();
    const member = await getMembers({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json(
        {
          success: false,
          error: true,
          message: "UnAuthorized",
          data: null,
        },
        403
      );
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const taskCount = thisMonthTasks.total;
    const taskDifference = taskCount - lastMonthTasks.total;

    const thisMonthAssignTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const assigneeTaskCount = thisMonthAssignTask.total;
    const assigneeTaskDifference =
      assigneeTaskCount - lastMonthAssignTask.total;

    const thisMonthInCompleteTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TasksStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthInCompleteTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TasksStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const inCompletedTask = thisMonthInCompleteTask.total;
    const inCompletedTaskDifference =
      lastMonthInCompleteTask.total - inCompletedTask;

    const thisMonthCompletedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TasksStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TasksStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const completedTask = thisMonthCompletedTask.total;
    const completedTaskDifference =
      lastMonthCompletedTask.total - completedTask;

    const thisMonthOverDueTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TasksStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthOverDueTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TasksStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const overDueTask = thisMonthOverDueTask.total;
    const overDueTaskDifference = lastMonthOverDueTask.total - overDueTask;

    return c.json(
      {
        data: {
          taskCount,
          taskDifference,
          assigneeTaskCount,
          assigneeTaskDifference,
          overDueTask,
          overDueTaskDifference,
          inCompletedTask,
          inCompletedTaskDifference,
          completedTask,
          completedTaskDifference,
        },
      },
      200
    );
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
        message: "Add Workspace Successfully",
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
  )

  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMembers({
      databases,
      workspaceId,
      userId: user.$id,
    });

    // TODO: Delete Members, Projects, and Tasks

    if (!member || member.role !== Member_Role.ADMIN)
      return c.json(
        {
          success: false,
          error: true,
          message: "UnAuthorized",
          data: null,
        },
        403
      );

    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

    return c.json({
      status: 200,
      success: true,
      error: false,
      message: "Workspace Deleted Successfully",
      data: { $id: workspaceId },
    });
  })

  .post("/:workspaceId/reset_inviteCode", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMembers({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== Member_Role.ADMIN)
      return c.json(
        {
          success: false,
          error: true,
          message: "UnAuthorized",
          data: null,
        },
        403
      );

    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      { inviteCode: generateInviteCode(6) }
    );

    return c.json({
      status: 200,
      success: true,
      error: false,
      message: "Update invite code successfully",
      data: workspace,
    });
  })

  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");

      const member = await getMembers({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (member)
        return c.json({
          status: 400,
          success: false,
          error: true,
          message: "Already a member",
          data: null,
        });

      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (workspace.inviteCode !== code) {
        return c.json({
          status: 400,
          success: false,
          error: true,
          message: "Invalid invite code",
          data: null,
        });
      }

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        workspaceId,
        userId: user.$id,
        role: Member_Role.MEMBER,
      });

      return c.json({
        status: 200,
        success: true,
        error: false,
        message: "Joined workspace successfully",
        data: workspace,
      });
    }
  );

export default app;
