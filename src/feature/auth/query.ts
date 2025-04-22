"use server";
import { createSessionClient } from "@/lib/appwrite";
export const getCurrent = async () => {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    console.error("error in action file with auth" + error);
    return null;
  }
};
