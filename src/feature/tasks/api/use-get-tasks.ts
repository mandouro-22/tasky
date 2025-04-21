import { client } from "@/lib/Rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.tasks.$get>;

interface useGetTasksProps {
  workspaceId: string;
}

export const useGetTasks = ({ workspaceId }: useGetTasksProps) => {
  const query = useQuery<ResponseType>({
    queryKey: ["tasks", workspaceId],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch Tasks");

      return await response.json();
    },
  });

  return query;
};
