import React from "react";
import { Task, TasksStatus } from "../type";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import DottedSeparatoo from "@/components/dotted-separator";
import OverviewProperty from "./overview-property";
import MemberAvatar from "@/feature/members/components/member-avatar";
import TaskDate from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModel } from "../hooks/use-edit-tasks-model";

interface TaskOverviewProps {
  task: Task;
}

export default function TaskOverview({ task }: TaskOverviewProps) {
  const { open } = useEditTaskModel();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            variant={"secondary"}
            size={"sm"}
            onClick={() => open(task.$id)}
          >
            <PencilIcon className="size-4 mr-1" />
            Edit Task
          </Button>
        </div>
        <DottedSeparatoo className="my-4" />

        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar name={task.assignee.name} className="size-6" />

            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>

          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>

          <OverviewProperty label="Status">
            <Badge variant={task.status as TasksStatus}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
}
