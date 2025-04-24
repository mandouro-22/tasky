"use client";
import { ResponsiveModel } from "@/components/responsive/responsive-model";
import { useCreateTasksModel } from "../hooks/use-create-tasks-model";
import CreateTaskWrapper from "./create-task-wrapper";

export function CreateTaskModel() {
  const { isOpen, setIsOpen, close } = useCreateTasksModel();
  return (
    <ResponsiveModel open={isOpen} onOpenChange={setIsOpen}>
      <CreateTaskWrapper onCancel={close} />
    </ResponsiveModel>
  );
}
