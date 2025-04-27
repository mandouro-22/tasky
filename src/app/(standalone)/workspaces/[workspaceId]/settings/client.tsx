"use client";

import ErrorPage from "@/components/error/error";
import LoadingPage from "@/components/loading/Loading";
import { useGetWorkspace } from "@/feature/workspaces/api/use-get-workspaces-by-id";
import EditWorkspaceForm from "@/feature/workspaces/components/edit-workspaces-form";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";
import { Workspace } from "@/feature/workspaces/type";

export default function SettingWorkspace() {
  const workspaceId = useWorkspaceId();
  const { data: initialValues, isLoading } = useGetWorkspace(workspaceId);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!initialValues) {
    return <ErrorPage message="Project not found" />;
  }

  return (
    <div className="w-full lg:max-w-screen-xl mx-auto">
      <EditWorkspaceForm initialValue={initialValues.data as Workspace} />
    </div>
  );
}
