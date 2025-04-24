import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { TasksStatus } from "../type";

export const useTasksFilter = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TasksStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};
