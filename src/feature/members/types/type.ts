import { Models } from "node-appwrite";

export enum Member_Role {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export type Member = Models.Document & {
  workspaceId: string;
  userId: string;
  role: Member_Role;
};
