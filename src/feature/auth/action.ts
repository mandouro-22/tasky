"use server";
import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { AUTH_COOKIE } from "./constant";

export const getCurrent = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = cookies().get(AUTH_COOKIE);

    if (!session || !session.value) return null;

    client.setSession(session.value);

    const account = new Account(client);
    return await account.get();
  } catch (error) {
    console.error("error in action file with auth" + error);
    return null;
  }
};
