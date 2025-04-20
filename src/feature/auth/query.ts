"use server";
import { createSessionClient } from "@/lib/appwrite";

export const getCurrent = async () => {
  const { account } = await createSessionClient();
  if (!account) throw new Error("UnAuthorized");
  return await account.get();
};
