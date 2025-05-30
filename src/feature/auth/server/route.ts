import { SignInSchema } from "@/validations/auth/sign-in-schema";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { SignUpSchema } from "@/validations/auth/sign-up-schema";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE } from "../constant";
import { sessionMiddleware } from "@/lib/session_middleware";

const app = new Hono()
  .get("/current", sessionMiddleware, (c) => {
    try {
      const user = c.get("user");
      return c.json(
        {
          status: 200,
          success: true,
          message: "Get user successfully",
          data: user,
        },
        200
      );
    } catch (error) {
      console.error("error in current user in the server", error);
      return c.json(
        {
          status: 500,
          message: error,
          success: false,
          data: null,
        },
        500
      );
    }
  })
  .post("/login", zValidator("json", SignInSchema), async (c) => {
    try {
      const { email, password } = c.req.valid("json");

      const { account } = await createAdminClient();

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json(
        {
          success: true,
          message: "Login Successfully ✅",
          data: {
            email,
            password,
          },
        },
        200
      );
    } catch (error) {
      console.error("error in login file in server" + error);
      return c.json(
        {
          status: 500,
          message: error,
          success: false,
        },
        500
      );
    }
  })
  .post("/register", zValidator("json", SignUpSchema), async (c) => {
    try {
      const { name, email, password } = c.req.valid("json");
      const { account } = await createAdminClient();
      const user = await account.create(ID.unique(), email, password, name);
      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json(
        {
          success: true,
          message: "create account Successfully",
          data: user,
        },
        200
      );
    } catch (error) {
      console.error("error in register file in server" + error);
      return c.json(
        {
          status: 500,
          message: error,
          success: false,
        },
        500
      );
    }
  })
  .post("/logout", sessionMiddleware, async (c) => {
    // logout email.
    try {
      const account = c.get("account");
      deleteCookie(c, AUTH_COOKIE);
      await account.deleteSession("current");

      return c.json(
        {
          success: true,
          error: null,
          message: "Logout Successfully",
        },
        200
      );
    } catch (error) {
      console.error("error in logout file in server" + error);
      return c.json(
        {
          status: 500,
          message: error,
          success: false,
        },
        500
      );
    }
  });

export default app;
