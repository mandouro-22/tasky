import { getCurrent } from "@/feature/auth/query";
import { redirect } from "next/navigation";
import React from "react";
import SettingWorkspace from "./client";

export default async function WorkspaceIdSettingPage() {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");

  return <SettingWorkspace />;
}
