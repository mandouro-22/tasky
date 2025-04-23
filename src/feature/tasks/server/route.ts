import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMembers } from "@/feature/members/utils";
import { CreateAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session_middleware";
import {
  createTaskSchema,
  getTaskSchema,
} from "@/validations/tasks/tasks-schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { buildTaskQuery } from "./buildTaskQuery";
import { Project } from "@/feature/projects/type";
import { Task } from "../type";

const Tasks = new Hono()

  .get(
    "/",
    sessionMiddleware,
    zValidator("query", getTaskSchema),
    async (c) => {
      const { users } = await CreateAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId, assigneeId, dueDate, projectId, search, status } =
        c.req.valid("query");

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

      const rawFilters = { projectId, assigneeId, status, dueDate };

      const filters = Object.fromEntries(
        Object.entries(rawFilters).filter(([, value]) => value != null)
      ) as Record<string, string>;

      const query = buildTaskQuery(workspaceId, filters, search);

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
      );

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );
        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        );

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        status: 200,
        error: null,
        success: true,
        message: "get Task Successfully",
        data: {
          ...tasks,
          documents: populatedTasks,
        },
      });
    }
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const currentUser = c.get("user");
    const databases = c.get("databases");
    const { users } = await CreateAdminClient();
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const currentMember = await getMembers({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });

    if (!currentMember)
      return c.json(
        {
          error: true,
          success: false,
          message: "UnAuthorized",
          data: null,
        },
        401
      );

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      task.projectId
    );

    const members = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      task.assigneeId
    );

    const user = await users.get(members.userId);

    const assignee = {
      ...members,
      name: user.name,
      email: user.email,
    };

    return c.json(
      {
        error: false,
        success: true,
        message: "Get task by id successfully",
        data: {
          ...task,
          project,
          assignee,
        },
      },
      200
    );
  })
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const {
        assigneeId,
        dueDate,
        name,
        projectId,
        status,
        workspaceId,
        description,
      } = c.req.valid("json");

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

      const highestPostitionTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderDesc("position"),
          Query.limit(1),
        ]
      );

      const highestTask = highestPostitionTasks.documents[0];
      const newPosition = highestTask?.position
        ? highestTask.position + 1000
        : 1000;

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          assigneeId,
          dueDate,
          name,
          projectId,
          status,
          workspaceId,
          description,
          position: newPosition,
        }
      );

      return c.json({
        status: 200,
        error: null,
        success: true,
        message: "Add Task Successfully",
        data: task,
      });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { taskId } = c.req.param();
      const { assigneeId, description, dueDate, name, projectId, status } =
        c.req.valid("json");

      const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
      );

      const member = await getMembers({
        databases,
        workspaceId: task.workspaceId,
        userId: user.$id,
      });

      if (!member)
        return c.json(
          {
            error: true,
            success: false,
            message: "UnAuthorized",
            data: null,
          },
          401
        );

      const updateTask = await databases.updateDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
          assigneeId,
          description,
          dueDate,
          name,
          projectId,
          status,
        }
      );

      return c.json(
        {
          error: false,
          success: true,
          message: "Update Task Successfully",
          data: updateTask,
        },
        200
      );
    }
  )
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      DATABASE_ID,
      TASKS_ID,
      taskId
    );

    const member = await getMembers({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json(
        {
          error: true,
          success: false,
          message: "UnAuthorized",
          data: null,
        },
        401
      );
    }

    await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

    return c.json(
      {
        error: false,
        success: true,
        message: "Delete Task Successfully",
        data: {
          $id: taskId,
        },
      },
      200
    );
  });

export default Tasks;
