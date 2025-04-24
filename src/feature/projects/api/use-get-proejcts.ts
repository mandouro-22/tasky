import { client } from "@/lib/Rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.projects.$get>;

interface UseGetProjectsProps {
  workspaceId: string;
}

export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
  const query = useQuery<ResponseType>({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: {
          workspaceId,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch projects");

      return await response.json();
    },
  });
  return query;
};
