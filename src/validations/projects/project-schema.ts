import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Name is Required",
  }),
  imageUrl: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string(),
});

export type CreatePrjectSchemaType = z.infer<typeof CreateProjectSchema>;
