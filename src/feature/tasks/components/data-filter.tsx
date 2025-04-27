import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { TasksStatus } from "../type";
import { FolderIcon, ListCheckIcon, UserIcon } from "lucide-react";
import { useTasksFilter } from "../hooks/use-tasks-filter";
import { useGetProjects } from "@/feature/projects/api/use-get-proejcts";
import { useGetMembers } from "@/feature/members/api/use-get-workspaces";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";
import MemberAvatar from "@/feature/members/components/member-avatar";
import { ProjectAvatar } from "@/components/projects/project-avatar";
import { DatePicker } from "@/components/ui/date-picker";
interface DataFilterProps {
  hideProjectFilter?: boolean;
}

const Status = [
  {
    value: "all",
    title: "All Status",
  },
  {
    value: TasksStatus.BACKLOG,
    title: "Backlog",
  },
  {
    value: TasksStatus.TODO,
    title: "Todo",
  },
  {
    value: TasksStatus.IN_PROGRESS,
    title: "In Progress",
  },
  {
    value: TasksStatus.IN_REVIEW,
    title: "In Review",
  },
  {
    value: TasksStatus.DONE,
    title: "Done",
  },
];

export default function DataFilter({ hideProjectFilter }: DataFilterProps) {
  const [{ assigneeId, dueDate, projectId, status }, setFilter] =
    useTasksFilter();

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
  const handleStatusChange = (value: string) => {
    setFilter({ status: value === "all" ? null : (value as TasksStatus) });
  };

  const handleAssgineeChange = (value: string) => {
    setFilter({ assigneeId: value === "all" ? null : (value as TasksStatus) });
  };
  const handleProjectChange = (value: string) => {
    setFilter({ projectId: value === "all" ? null : (value as TasksStatus) });
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-2">
      <Select
        disabled={isLoading}
        defaultValue={status ?? undefined}
        onValueChange={(value) => handleStatusChange(value)}
      >
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <ListCheckIcon className="size-5" />
            <SelectValue placeholder="All Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {Status.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        disabled={isLoading}
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => handleAssgineeChange(value)}
      >
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <UserIcon className="size-5" />
            <SelectValue placeholder="All assignee" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {memberOption?.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              <div className="flex items-center gap-2">
                <MemberAvatar name={member.name} className="size-6" />
                {member.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!hideProjectFilter && (
        <Select
          disabled={isLoading}
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => handleProjectChange(value)}
        >
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <FolderIcon className="size-5" />
              <SelectValue placeholder="All Projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {projectOption?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center gap-2">
                  <ProjectAvatar
                    name={project.name}
                    image={project.imageUrl}
                    className="size-6"
                  />
                  {project.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <DatePicker
        onChange={(value) =>
          setFilter({ dueDate: value ? value.toISOString() : null })
        }
        value={dueDate ? new Date(dueDate) : undefined}
        placeholder="Due date"
        className="h-12 bg-transparent hover:bg-transparent w-full lg:w-auto"
      />
    </div>
  );
}
