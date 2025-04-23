import { client } from "@/lib/Rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$get"],
  200
>;

export const useGetTaskById = (taskId: string) => {
  const query = useQuery<ResponseType>({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"]["$get"]({
        param: { taskId },
      });

      if (!response.ok) throw new Error("Failed to get task");

      return response.json();
    },
  });

  return query;
};
