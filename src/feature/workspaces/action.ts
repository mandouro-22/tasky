import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";
import { AUTH_COOKIE } from "../auth/constant";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMembers } from "../members/utils";
import { Workspace } from "./type";

interface GetWorkspaceProps {
  workspaceId: string;
}

export const getWorkspaces = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE);

    if (!session || !session.value) return { total: 0, documents: [] };

    client.setSession(session.value);

    const database = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    const members = await database.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return { total: 0, documents: [] };
    }

    const workspacesId = members.documents.map((member) => member.workspaceId);

    const workspaces = await database.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspacesId)]
    );

    return workspaces;
  } catch (error) {
    console.error("error in action file with auth" + error);
    return { total: 0, documents: [] };
  }
};

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE);

    if (!session || !session.value) return null;

    client.setSession(session.value);

    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    const member = await getMembers({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) return null;

    const workspaces = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return workspaces;
  } catch (error) {
    console.error("error in action file with auth" + error);
    return null;
  }
};
