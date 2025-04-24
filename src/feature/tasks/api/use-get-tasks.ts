import { client } from "@/lib/Rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.tasks.$get>;

interface useGetTasksProps {
  workspaceId: string;
  search?: string;
  status?: string;
  projectId?: string;
  assigneeId?: string;
  dueDate?: string;
}

export const useGetTasks = ({
  workspaceId,
  search,
  status,
  projectId,
  assigneeId,
  dueDate,
}: useGetTasksProps) => {
  const query = useQuery<ResponseType>({
    queryKey: [
      "tasks",
      workspaceId,
      search,
      status,
      projectId,
      assigneeId,
      dueDate,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          search: search ?? undefined,
          status: status ?? undefined,
          projectId: projectId ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch Tasks");

      return await response.json();
    },
  });

  return query;
};
