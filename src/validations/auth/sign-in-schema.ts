import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z
    .string()
    .trim()
    .min(2, { message: "Password is required" })
    .max(52, "The value must not exceed 52 character"),
});

export type inferSignInSchema = z.infer<typeof SignInSchema>;
