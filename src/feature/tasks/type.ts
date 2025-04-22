import { Models } from "node-appwrite";

export enum TasksStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Task = Models.Document & {
  projectId: string;
  name: string;
  assigneeId: string;
  status: string;
  position: number;
  dueDate: string;
};
