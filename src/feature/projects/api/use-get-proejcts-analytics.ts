import { client } from "@/lib/Rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type ProjectAnalyticsResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["analytics"]["$get"]
>;

export const useGetProjectAnalytics = (projectId: string) => {
  const query = useQuery<ProjectAnalyticsResponseType>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"]["analytics"][
        "$get"
      ]({ param: { projectId } });

      if (!response.ok) throw new Error("Failed to fetch project analytics");

      return await response.json();
    },
  });
  return query;
};
