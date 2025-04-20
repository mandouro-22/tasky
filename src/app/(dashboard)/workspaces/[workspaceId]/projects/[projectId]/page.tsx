import { ProjectAvatar } from "@/components/projects/project-avatar";
import { getCurrent } from "@/feature/auth/query";
import { getProject } from "@/feature/projects/queries";
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
        </div>
      </div>
    </div>
  );
}
