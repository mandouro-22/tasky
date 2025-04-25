import { client } from "@/lib/Rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$get"]
>;

interface UseGetProjectsProps {
  projectId: string;
}

export const useGetProject = ({ projectId }: UseGetProjectsProps) => {
  const query = useQuery<ResponseType>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"]["$get"]({
        param: {
          projectId,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch project");

      return await response.json();
    },
  });
  return query;
};
