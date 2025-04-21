"use client";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import { useGetProjects } from "@/feature/projects/api/use-get-proejcts";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { useCreateProjectModel } from "@/feature/projects/hooks/use-create-projects-model";
import Link from "next/link";
import { ProjectAvatar } from "./project-avatar";
// import { useProjectId } from "@/feature/projects/hooks/use-project-id";

export default function Projects() {
  // const projectId = useProjectId(); // TODO: use the useProjectId hook.
  const workspaceId = useWorkspaceId();
  const { open } = useCreateProjectModel();

  const { data } = useGetProjects({ workspaceId });
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xs text-neutral-500 uppercase">Projects</h1>
        <RiAddCircleFill
          className="size-4 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          onClick={open}
        />
      </div>
      {data?.data?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathname === href;
        return (
          <Link href={href} key={project.$id}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-1.5 border border-gray-200 rounded-md hover:opacity-75 transition cursor-pointer",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <ProjectAvatar name={project.name} image={project.imageUrl} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
