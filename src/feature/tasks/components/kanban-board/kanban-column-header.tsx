import { snakeCaseToTitleCase } from "@/lib/utils";
import { TasksStatus } from "../../type";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTasksModel } from "../../hooks/use-create-tasks-model";

interface KanbanColumnHeaderProps {
  board: TasksStatus;
  taskCount: number;
}

const statusIconMap: Record<TasksStatus, React.ReactNode> = {
  [TasksStatus.BACKLOG]: (
    <CircleDashedIcon className="size-[16px] text-pink-400" />
  ),
  [TasksStatus.TODO]: <CircleDashedIcon className="size-[16px] text-red-400" />,
  [TasksStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[16px] text-[#cddc39]" />
  ),
  [TasksStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-[16px] text-blue-400" />
  ),
  [TasksStatus.DONE]: (
    <CircleCheckIcon className="size-[16px] text-green-400" />
  ),
};

export default function KanbanColumnHeader({
  board,
  taskCount,
}: KanbanColumnHeaderProps) {
  const { open } = useCreateTasksModel();

  const icon = statusIconMap[board];

  return (
    <div className="px-2 py-1 5 flex items-center justify-between mt-2">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="capitalize text-sm font-medium">
          {snakeCaseToTitleCase(board)}
        </h2>
        <strong className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
          {taskCount}
        </strong>
      </div>
      <Button onClick={open} variant="ghost" size="icon" className="size-5">
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
}
