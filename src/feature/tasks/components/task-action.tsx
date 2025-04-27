import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ExternalLinkIcon,
  FolderIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { useDeleteTask } from "../api/use-delete-task";
import useConfirm from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";
import { useEditTaskModel } from "../hooks/use-edit-tasks-model";
import { cn } from "@/lib/utils";

interface TaskActionProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
  className?: string;
}

export default function TaskAction({
  id,
  projectId,
  children,
  className,
}: TaskActionProps) {
  const [ConfirmDelete, confirm] = useConfirm(
    "Delete Task",
    "This action cannot be undone.",
    "destructive"
  );
  const { mutate: deleteTask, isPending: loadingDelete } = useDeleteTask();
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return null;
    deleteTask({ param: { taskId: id } });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };
  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };
  const { open } = useEditTaskModel();

  return (
    <div className={cn("flex justify-end", className)}>
      <ConfirmDelete />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenTask}
            className="font-medium p-2 cursor-pointer"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            className="font-medium p-2 cursor-pointer"
          >
            <FolderIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            disabled={false}
            className="font-medium p-2 cursor-pointer"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDeleteTask}
            disabled={loadingDelete}
            className=" text-amber-700 focus:text-amber-700 font-medium p-2 cursor-pointer"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
