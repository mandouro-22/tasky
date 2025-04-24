import { useGetMembers } from "@/feature/members/api/use-get-workspaces";
import { useGetProjects } from "@/feature/projects/api/use-get-proejcts";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";
import React from "react";
import { CreateTaskForm } from "./create-task-form";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";

interface CreateTaskFormWrapperProps {
  onCancel: () => void;
}

export default function CreateTaskWrapper({
  onCancel,
}: CreateTaskFormWrapperProps) {
  const workspaceId = useWorkspaceId();
  const { data: project, isLoading: isLoadingProject } = useGetProjects({
    workspaceId,
  });
  const { data: member, isLoading: isLoadingMember } = useGetMembers({
    workspaceId,
  });

  const isLoading = isLoadingMember || isLoadingProject;

  const projectOption = project?.data?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOption = member?.data?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

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
      <CreateTaskForm
        onCancel={onCancel}
        memberOptions={memberOption ?? []}
        projectOptions={projectOption ?? []}
      />
    </div>
  );
}
