import { Task } from "@/feature/tasks/type";
import React from "react";
import { Button } from "../ui/button";
import { useCreateTasksModel } from "@/feature/tasks/hooks/use-create-tasks-model";
import { CalendarIcon, PlusIcon } from "lucide-react";
import DottedSeparatoo from "../dotted-separator";
import Link from "next/link";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";
import { Card, CardContent } from "../ui/card";
import { formatDistanceToNow } from "date-fns";

interface TasksListProps {
  data: Task[];
  total: number;
}

export function TasksList({ data, total }: TasksListProps) {
  const workspaceId = useWorkspaceId();
  const { open: createTask } = useCreateTasksModel();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Task ({total})</p>
          <Button variant={"muted"} size={"icon"} onClick={createTask}>
            <PlusIcon className="size-4 text-neutral-400 hover:text-neutral-600" />
          </Button>
        </div>
        <DottedSeparatoo className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none border-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate capitalize">
                      {task.name}
                    </p>
                    <div className="flex items-center gap-x-2">
                      <p>{task.project.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Tasks Found
          </li>
        </ul>
        <Button variant={"muted"} className="mt-4 w-full">
          <Link href={`/workspaces/${workspaceId}/tasks`}>show All</Link>
        </Button>
      </div>
    </div>
  );
}
