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

export default function ProjectIdClient() {
  const projectId = useProjectId();
  const { data, isLoading } = useGetProject({ projectId });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!data) {
    return <ErrorPage />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={data?.data?.name as string}
            image={data?.data?.imageUrl}
            className="size-10"
            fallbackClassName="size-10"
          />
          <h1 className="text-base font-bold">{data?.data?.name}</h1>
        </div>
        <Button variant={"secondary"}>
          <Link
            href={`/workspaces/${data?.data?.workspaceId}/projects/${data?.data?.$id}/settings`}
            className="flex items-center gap-2"
          >
            <Pen />
            Edit Project
          </Link>
        </Button>
      </div>
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
}
