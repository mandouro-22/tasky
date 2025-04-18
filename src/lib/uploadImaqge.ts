import { ID, Storage } from "node-appwrite";

export const uploadImageAsBase64 = async (
  storage: Storage,
  imageFile: File,
  bucketId: string
): Promise<string> => {
  const file = await storage.createFile(bucketId, ID.unique(), imageFile);

  const arrayBuffer = await storage.getFileDownload(bucketId, file.$id);

  return `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
};
