import { ProjectAvatar } from "@/components/projects/project-avatar";
import { Button } from "@/components/ui/button";
import { getCurrent } from "@/feature/auth/query";
import { getProject } from "@/feature/projects/queries";
import TaskViewSwitcher from "@/feature/tasks/components/task-view-switcher";
import { Pen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface ProjectIdParams {
  params: {
    projectId: string;
  };
}

export default async function ProjectIdPage({ params }: ProjectIdParams) {
  const user = await getCurrent();

  if (!user) {
    return redirect("/sign-in");
  }

  const initialValues = await getProject({ projectId: params.projectId });

  if (!initialValues) throw new Error("Project Not Found");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={initialValues.name}
            image={initialValues.imageUrl}
            className="size-10"
            fallbackClassName="size-10"
          />
          <h1 className="text-base font-bold">{initialValues.name}</h1>
        </div>
        <Button variant={"secondary"}>
          <Link
            href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}
            className="flex items-center gap-2"
          >
            <Pen />
            Edit Project
          </Link>
        </Button>
      </div>
      <TaskViewSwitcher />
    </div>
  );
}
