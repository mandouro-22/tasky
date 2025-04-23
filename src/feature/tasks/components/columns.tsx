"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { Task, TasksStatus } from "../type";
import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/components/projects/project-avatar";
import TaskDate from "./task-date";
import MemberAvatar from "@/feature/members/components/member-avatar";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import TaskAction from "./task-action";
export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.project;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <ProjectAvatar
            className="size-6"
            name={project.name}
            image={project.imageUrl}
          />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
        </Button>
      );
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <MemberAvatar
            className="size-6"
            fallbackClassName="text-xs"
            name={assignee.name}
          />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <TaskDate value={dueDate} />
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status as TasksStatus;
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium ">
          <Badge variant={status} className="capitalize">
            {snakeCaseToTitleCase(status)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "Action",
    id: "action",
    cell: ({ row }) => {
      const id = row.original.$id;
      const projectId = row.original.projectId;

      return (
        <TaskAction id={id} projectId={projectId}>
          <Button size={"sm"} variant={"ghost"}>
            <MoreVertical />
          </Button>
        </TaskAction>
      );
    },
  },
];
