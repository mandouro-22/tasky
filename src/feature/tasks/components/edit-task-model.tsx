"use client";
import { ResponsiveModel } from "@/components/responsive/responsive-model";
import { useEditTaskModel } from "../hooks/use-edit-tasks-model";
import EditTaskFormWrapper from "./edit-task-wrapper";

export function EditTaskModel() {
  const { taskId, close, open } = useEditTaskModel();
  console.log(open);
  return (
    <ResponsiveModel open={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskFormWrapper onCancel={close} taskId={taskId} />}
    </ResponsiveModel>
  );
}
