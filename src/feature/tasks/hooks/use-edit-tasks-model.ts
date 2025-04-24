"use client";
import { useQueryState, parseAsString } from "nuqs";

export const useEditTaskModel = () => {
  const [taskId, setTaskId] = useQueryState("edit_task", parseAsString);
  const open = (id: string) => setTaskId(id);
  const close = () => setTaskId(null);

  return {
    open,
    taskId,
    close,
    setTaskId,
  };
};
