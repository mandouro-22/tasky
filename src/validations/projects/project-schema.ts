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

export const UpdateProjectSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Minimum 1 character Required",
  }),
  imageUrl: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export type CreatePrjectSchemaType = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectSchemaType = z.infer<typeof UpdateProjectSchema>;
