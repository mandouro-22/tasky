import { TasksStatus } from "@/feature/tasks/type";
import { z } from "zod";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  status: z.nativeEnum(TasksStatus, { required_error: "Status is required" }),
  workspaceId: z.string().trim().min(1, { message: "workspaceId is required" }),
  projectId: z.string().trim().min(1, { message: "projectId is required" }),
  assigneeId: z.string().trim().min(1, { message: "assigneeId is required" }),
  description: z.string().trim().optional(),
  dueDate: z.coerce.date(),
});

export const getTaskSchema = z.object({
  workspaceId: z.string(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  status: z.nativeEnum(TasksStatus).nullish(),
  search: z.string().nullish(),
  dueDate: z.string().nullish(),
});

export type CreateTasksSchemaType = z.infer<typeof createTaskSchema>;
