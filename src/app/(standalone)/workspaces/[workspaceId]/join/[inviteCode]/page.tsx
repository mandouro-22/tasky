import { getCurrent } from "@/feature/auth/query";
import { redirect } from "next/navigation";
import WorkspaceIdJoinClient from "./client";

export default async function WorkspaceIdJoinPage() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <WorkspaceIdJoinClient />;
}
