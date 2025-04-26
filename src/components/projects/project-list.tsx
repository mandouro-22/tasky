import Link from "next/link";
// import { formatDistanceToNow } from "date-fns";
import { PlusIcon } from "lucide-react";
import { Project } from "@/feature/projects/type";
import { Button } from "../ui/button";
import DottedSeparatoo from "../dotted-separator";
import { Card, CardContent } from "../ui/card";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";
import { useCreateProjectModel } from "@/feature/projects/hooks/use-create-projects-model";
import { ProjectAvatar } from "./project-avatar";

interface ProjectListProps {
  data: Project[];
  total: number;
}

export function ProjectList({ data, total }: ProjectListProps) {
  const workspaceId = useWorkspaceId();
  const { open: createTask } = useCreateProjectModel();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant={"secondary"} size={"icon"} onClick={createTask}>
            <PlusIcon className="size-4 text-neutral-400 hover:text-neutral-600" />
          </Button>
        </div>
        <DottedSeparatoo className="my-4" />
        <ul className="grid grid-col-1 lg:grid-col-2 gap-4">
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none border-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className="size-12"
                      fallbackClassName="text-lg"
                    />

                    <p className="text-lg font-medium truncate">
                      {project.name}
                    </p>

                    {/*<p className="text-lg font-medium truncate capitalize">
                      {project.name}
                    </p>
                    <div className="flex items-center gap-x-2">
                      <p>{project.project.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(project.dueDate))}
                        </span>
                      </div>
                    </div>*/}
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Projects Found
          </li>
        </ul>
        <Button variant={"muted"} className="mt-4 w-full">
          <Link href={`/workspaces/${workspaceId}/tasks`}>show All</Link>
        </Button>
      </div>
    </div>
  );
}
