import { getCurrent } from "@/feature/auth/query";
import { getWorkspace } from "@/feature/workspaces/query";
import EditWorkspaceForm from "@/feature/workspaces/components/edit-workspaces-form copy";
import { redirect } from "next/navigation";
import React from "react";

interface WorkspaceIdSettingProps {
  params: {
    workspaceId: string;
  };
}

export default async function WorkspaceIdSettingPage({
  params,
}: WorkspaceIdSettingProps) {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");

  const initialValue = await getWorkspace({ workspaceId: params.workspaceId });

  if (!initialValue) redirect(`/workspaces/${params.workspaceId}`);

  return (
    <div>
      <EditWorkspaceForm initialValue={initialValue} />
    </div>
  );
}
