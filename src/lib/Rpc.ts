import type { AppType } from "@/app/(auth)/api/[[...route]]/route";
import { hc } from "hono/client";

if (!process.env.NEXT_PUBLIC_APP_URL) {
  throw new Error("URL Host is not defined 😭");
}

export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
