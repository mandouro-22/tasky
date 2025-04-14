import "server-only";
import { createMiddleware } from "hono/factory";
import {
  Account,
  Client,
  Databases,
  Models,
  Storage,
  type Account as AccountType,
  type Databases as DatabasesType,
  type Storage as StorageType,
  type Users as UsersTypes,
} from "node-appwrite";
import { getCookie } from "hono/cookie";
import { AUTH_COOKIE } from "@/feature/auth/constant";

type AdditionalContext = {
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
    users: UsersTypes;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = getCookie(c, AUTH_COOKIE);

    if (!session)
      return c.json({
        status: 401,
        error: true,
        message: "UnAuthorized",
      });

    client.setSession(session);

    const account = new Account(client);
    const database = new Databases(client);
    const storage = new Storage(client);
    const user = await account.get();

    c.set("account", account);
    c.set("databases", database);
    c.set("storage", storage);
    c.set("user", user);

    await next();
  }
);
