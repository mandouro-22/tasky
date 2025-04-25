"use client";

import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/components/projects/project-avatar";
import { useProjectId } from "@/feature/projects/hooks/use-project-id";
import TaskViewSwitcher from "@/feature/tasks/components/task-view-switcher";
import { Pen } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useGetProject } from "@/feature/projects/api/use-get-proejcts-by-id";
import LoadingPage from "@/components/loading/Loading";
import ErrorPage from "@/components/error/error";
import { useGetProjectAnalytics } from "@/feature/projects/api/use-get-proejcts-analytics";
import Analytics from "@/components/analytics/analytics";

export default function ProjectIdClient() {
  const projectId = useProjectId();
  const { data: project, isLoading: isLoadingGetProject } = useGetProject({
    projectId,
  });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics(projectId);

  console.log(analytics);

  const isLoading = isLoadingAnalytics || isLoadingGetProject;

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!project || !analytics) {
    return <ErrorPage />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project?.data?.name as string}
            image={project?.data?.imageUrl}
            className="size-10"
            fallbackClassName="size-10"
          />
          <h1 className="text-base font-bold">{project?.data?.name}</h1>
        </div>
        <Button variant={"secondary"}>
          <Link
            href={`/workspaces/${project?.data?.workspaceId}/projects/${project?.data?.$id}/settings`}
            className="flex items-center gap-2"
          >
            <Pen />
            Edit Project
          </Link>
        </Button>
      </div>
      {analytics.data ? <Analytics data={analytics.data} /> : null}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
}
