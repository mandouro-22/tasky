import { DATABASE_ID, IMAGE_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMembers } from "@/feature/members/utils";
import { sessionMiddleware } from "@/lib/session_middleware";
import { uploadImageAsBase64 } from "@/lib/uploadImaqge";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
} from "@/validations/projects/project-schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Project } from "../type";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TasksStatus } from "@/feature/tasks/type";

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
        return c.json(
          {
            success: false,
            error: true,
            message: "Missing workspaceId",
            data: null,
          },
          400
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

      const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);

      return c.json(
        {
          success: true,
          error: false,
          message: "Get Prjects Successfully",
          data: projects,
        },
        200
      );
    }
  )
  .get("/:projectId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMembers({
      databases,
      workspaceId: project.workspaceId,
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
        message: "Get Prject Successfully",
        data: project,
      },
      200
    );
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { projectId } = c.req.param();
    console.log("projectId 🆔", projectId);
    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    if (!projectId) {
      return c.json(
        {
          success: false,
          error: true,
          message: "Missing projectId",
          data: null,
        },
        400
      );
    }

    const member = await getMembers({
      databases,
      workspaceId: project.workspaceId,
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
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.notEqual("status", TasksStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthInCompleteTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.equal("status", TasksStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTask = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
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
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", UpdateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { imageUrl, name } = c.req.valid("form");

      const exsitProject = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const member = await getMembers({
        databases,
        workspaceId: exsitProject.workspaceId,
        userId: user.$id,
      });

      if (!member)
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

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json(
        {
          error: null,
          success: true,
          message: "Update Project Successfully",
          data: project,
        },
        200
      );
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { projectId } = c.req.param();

    const exsitProject = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const memeber = await getMembers({
      databases,
      workspaceId: exsitProject.workspaceId,
      userId: user.$id,
    });

    if (!memeber) {
      return c.json({
        status: 401,
        success: false,
        error: true,
        message: "UnAuthorized",
        data: null,
      });
    }

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return c.json({
      status: 200,
      success: true,
      error: false,
      message: "Project Deleted Successfully",
      data: { $id: projectId },
    });
  });

export default Projects;
