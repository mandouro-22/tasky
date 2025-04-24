"use client";
import React from "react";
import DottedSeparatoo from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";
import { useCreateTasksModel } from "../hooks/use-create-tasks-model";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";
import { useGetTasks } from "../api/use-get-tasks";
import { useQueryState } from "nuqs";
import DataFilter from "./data-filter";
import { useTasksFilter } from "../hooks/use-tasks-filter";
import { DataTable } from "./data-tabel";
import { columns } from "./columns";
import { DataKanban, TaskStatus } from "./kanban-board/data-kanban";
import { TasksStatus } from "../type";
import { useBulkEditTask } from "../api/use-bulk-update-task";

interface Tasks {
  $id: string;
  status: TaskStatus | TasksStatus;
  position: number;
}

export default function TaskViewSwitcher() {
  const [view, setView] = useQueryState("tab-tasks", {
    defaultValue: "tabel",
  });
  const [{ assigneeId, dueDate, projectId, search, status }] = useTasksFilter();
  const workspaceId = useWorkspaceId();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    search: search ?? undefined,
    status: status ?? undefined,
    projectId: projectId ?? undefined,
    assigneeId: assigneeId ?? undefined,
    dueDate: dueDate ?? undefined,
  });
  const { open } = useCreateTasksModel();
  const { mutate: bulkUpdate } = useBulkEditTask();

  const onKanbanChange = React.useCallback(
    (tasks: Tasks[]) => {
      const newTasks = tasks.map((task) => {
        return {
          $id: task.$id,
          status: task.status as TasksStatus,
          position: task.position,
        };
      });

      bulkUpdate({ json: { tasks: newTasks } });
    },
    [bulkUpdate]
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 border rounded-lg w-full"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="tabel" className="h-8 w-full lg:w-auto">
              Tabel
            </TabsTrigger>
            <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
              Kanban
            </TabsTrigger>
            <TabsTrigger value="calendar" className="h-8 w-full lg:w-auto">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button size={"sm"} className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="size-4" />
            New
          </Button>
        </div>
        <DottedSeparatoo className="my-3" />

        {isLoadingTasks ? (
          <div className="h-full w-full flex items-center justify-center flex-col">
            <Loader className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="w-full lg:w-fit px-2">
              <DataFilter />
            </div>

            <TabsContent value="tabel" className="mt-0">
              <DataTable
                columns={columns}
                data={tasks?.data?.documents ?? []}
              />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                data={tasks?.data?.documents ?? []}
                onChange={onKanbanChange}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              {JSON.stringify(tasks)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
}
