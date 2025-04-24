import { useGetMembers } from "@/feature/members/api/use-get-workspaces";
import { useGetProjects } from "@/feature/projects/api/use-get-proejcts";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useGetTaskById } from "../api/use-git-task-id";
import { EditTaskForm } from "./edit-task-form";

interface CreateTaskFormWrapperProps {
  onCancel: () => void;
  taskId: string;
}

export default function EditTaskFormWrapper({
  onCancel,
  taskId,
}: CreateTaskFormWrapperProps) {
  const workspaceId = useWorkspaceId();

  const { data: TaskById, isLoading: isLoadingTaskById } =
    useGetTaskById(taskId);

  const { data: project, isLoading: isLoadingProject } = useGetProjects({
    workspaceId,
  });
  const { data: member, isLoading: isLoadingMember } = useGetMembers({
    workspaceId,
  });

  const isLoading = isLoadingMember || isLoadingProject || isLoadingTaskById;

  const projectOption = project?.data?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOption = member?.data?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  if (!TaskById) return null;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] borde-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditTaskForm
        onCancel={onCancel}
        memberOptions={memberOption ?? []}
        projectOptions={projectOption ?? []}
        initialValues={TaskById.data}
      />
    </div>
  );
}
