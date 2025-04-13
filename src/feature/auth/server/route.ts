import { SignInSchema } from "@/validations/auth/sign-in-schema";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { SignUpSchema } from "@/validations/auth/sign-up-schema";
import { CreateAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { setCookie } from "hono/cookie";
import { AUTH_COOKIE } from "../constant";

const app = new Hono()
  .post("/login", zValidator("json", SignInSchema), (c) => {
    const { email, password } = c.req.valid("json");
    return c.json({
      success: true,
      message: "Login Successfuly ✅",
      data: {
        email,
        password,
      },
    });
  })
  .post("/register", zValidator("json", SignUpSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");
    const { account } = await CreateAdminClient();
    const user = await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({
      success: true,
      message: "create account successfuly",
      data: user,
    });
  });

export default app;
