"use client";
import DottedSeparatoo from "@/components/dotted-separator";
import ErrorPage from "@/components/error/error";
import LoadingPage from "@/components/loading/Loading";
import { useGetTaskById } from "@/feature/tasks/api/use-git-task-id";
import TaskBreadCrumbs from "@/feature/tasks/components/task-bread-crumbs";
import TaskDescription from "@/feature/tasks/components/task-description";
import TaskOverview from "@/feature/tasks/components/task-overview";
import { useTaskId } from "@/feature/tasks/hooks/use-task-id";
import React from "react";

export default function ClientPage() {
  const taskId = useTaskId();

  const { data, isLoading } = useGetTaskById(taskId);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!data) {
    return <ErrorPage />;
  }
  return (
    <div className="flex flex-col">
      <TaskBreadCrumbs project={data.data.project} task={data.data} />
      <DottedSeparatoo className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data.data} />
        <TaskDescription task={data.data} />
      </div>
    </div>
  );
}
