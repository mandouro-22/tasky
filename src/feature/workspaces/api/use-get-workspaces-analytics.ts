import { client } from "@/lib/Rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type workspaceAnalyticsResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["analytics"]["$get"],
  200
>;

export const useGetWorkspaceAnalytics = (workspaceId: string) => {
  const query = useQuery<workspaceAnalyticsResponseType>({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["analytics"][
        "$get"
      ]({ param: { workspaceId } });

      if (!response.ok) throw new Error("Failed to fetch workspace analytics");
      return await response.json();
    },
  });
  return query;
};
