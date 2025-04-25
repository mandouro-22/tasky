"use client";
import ErrorPage from "@/components/error/error";
import LoadingPage from "@/components/loading/Loading";
import { useGetWorkspaceInfo } from "@/feature/workspaces/api/use-get-workspaces-info";
import JoinWorkspaceForm from "@/feature/workspaces/components/join-workspace-form";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";
import React from "react";

export default function WorkspaceIdJoinClient() {
  const workspaceId = useWorkspaceId();
  const { data: initialValues, isLoading } = useGetWorkspaceInfo(workspaceId);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!initialValues) {
    return <ErrorPage message="Project not found" />;
  }

  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <JoinWorkspaceForm initialValues={initialValues.data} />
    </div>
  );
}
