import React from "react";
import { TasksStatus } from "../../type";
import { cn, snakeCaseToTitleCase } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/feature/projects/type";
import MemberAvatar from "@/feature/members/components/member-avatar";
import { ProjectAvatar } from "@/components/projects/project-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";

interface EventCardProps {
  id: string;
  title: string;
  project: Project;
  assignee: string;
  status: TasksStatus;
}

const statusColorsMap: Record<TasksStatus, string> = {
  [TasksStatus.TODO]: "border-l-red-500",
  [TasksStatus.IN_PROGRESS]: "border-l-[#cddc39",
  [TasksStatus.DONE]: "border-l-green-500",
  [TasksStatus.BACKLOG]: "border-l-pink-500",
  [TasksStatus.IN_REVIEW]: "border-l-blue-500",
};

export default function EventCard({
  id,
  title,
  project,
  assignee,
  status,
}: EventCardProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const OnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  console.log(assignee);

  return (
    <div className="px-2">
      <div
        onClick={OnClick}
        className={cn(
          "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorsMap[status] + " border-l-4"
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="text-sm font-semibold">{title}</div>
        </div>
        <div className="flex items-center gap-x-2">
          <MemberAvatar name={assignee} />
          <div className="size-1 rounded-full bg-neutral-300 " />
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col gap-x-2">
          <Badge className="capitalize" variant={status}>
            {snakeCaseToTitleCase(status)}
          </Badge>
        </div>
      </div>
    </div>
  );
}
