import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query, type Databases } from "node-appwrite";

interface GetMembersProps {
  databases: Databases;
  workspaceId: string;
  userId: string;
}

export const getMembers = async ({
  databases,
  workspaceId,
  userId,
}: GetMembersProps) => {
  const member = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("workspaceId", workspaceId),
    Query.equal("userId", userId),
  ]);

  return member.documents[0];
};
