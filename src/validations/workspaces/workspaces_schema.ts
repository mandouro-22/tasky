import { z } from "zod";

export const CreateWorkspacesSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  imageUrl: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export type inferCreateWorkspacesSchema = z.infer<
  typeof CreateWorkspacesSchema
>;
