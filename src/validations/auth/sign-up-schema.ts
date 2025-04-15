import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({ message: "Email is required" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(256, { message: "Password must not exceed 256 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
      message: "Include uppercase, lowercase, number & symbol",
    }),
});

export type inferSignUpSchema = z.infer<typeof SignUpSchema>;
