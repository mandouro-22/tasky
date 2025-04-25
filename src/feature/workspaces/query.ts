import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
// import { getMembers } from "../members/utils";
// import { Workspace } from "./type";
import { createSessionClient } from "@/lib/appwrite";

// interface GetWorkspaceProps {
//   workspaceId: string;
// }
// interface GetWorkspaceInfoProps {
//   workspaceId: string;
// }

export const getWorkspaces = async () => {
  const { account, databases } = await createSessionClient();
  const user = await account.get();

  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", user.$id),
  ]);

  if (members.total === 0) {
    return { total: 0, documents: [] };
  }

  const workspacesId = members.documents.map((member) => member.workspaceId);

  const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
    Query.orderDesc("$createdAt"),
    Query.contains("$id", workspacesId),
  ]);

  if (!workspaces) throw new Error("Workspaces Not Found");

  return workspaces;
};

// export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
//   const { account, databases } = await createSessionClient();
//   const user = await account.get();

//   const member = await getMembers({
//     databases,
//     workspaceId,
//     userId: user.$id,
//   });

//   if (!member) throw new Error("UnAuthorized");

//   const workspaces = await databases.getDocument<Workspace>(
//     DATABASE_ID,
//     WORKSPACES_ID,
//     workspaceId
//   );

//   return workspaces;
// };

// export const getWorkspaceInfo = async ({
//   workspaceId,
// }: GetWorkspaceInfoProps) => {
//   const { databases } = await createSessionClient();

//   const workspaces = await databases.getDocument<Workspace>(
//     DATABASE_ID,
//     WORKSPACES_ID,
//     workspaceId
//   );

//   if (!workspaces) throw new Error("Workspace Not Found");

//   return {
//     name: workspaces.name,
//   };
// };
