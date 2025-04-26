"use client";

import Analytics from "@/components/analytics/analytics";
import ErrorPage from "@/components/error/error";
import LoadingPage from "@/components/loading/Loading";
import { MembersList } from "@/components/member/member-list";
import { ProjectList } from "@/components/projects/project-list";
import { TasksList } from "@/components/tasks/tasks-list";
import { useGetMembers } from "@/feature/members/api/use-get-workspaces";
import { useGetProjects } from "@/feature/projects/api/use-get-proejcts";
import { useGetTasks } from "@/feature/tasks/api/use-get-tasks";
import { useGetWorkspaceAnalytics } from "@/feature/workspaces/api/use-get-workspaces-analytics";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";

export default function WorkspaceIdClient() {
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: loadingAnalytics } =
    useGetWorkspaceAnalytics(workspaceId);
  const { data: tasks, isLoading: loadingTasks } = useGetTasks({ workspaceId });
  const { data: projects, isLoading: loadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: loadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    loadingAnalytics || loadingTasks || loadingProjects || loadingMembers;

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!tasks || !projects || !members || !analytics) {
    return <ErrorPage message="Failed to load workspace data" />;
  }

  return (
    <div className="h-full flex flex-col gap-y-4">
      <Analytics data={analytics.data} />

      <div className="grid grid-col-1 lg:grid-col-2 gap-4">
        <TasksList
          data={tasks.data?.documents ?? []}
          total={tasks?.data?.total ?? 0}
        />
        <ProjectList
          data={projects.data?.documents ?? []}
          total={projects.data?.total ?? 0}
        />
        <MembersList
          data={members.data?.documents ?? []}
          total={members.data?.total ?? 0}
        />
      </div>
    </div>
  );
}
