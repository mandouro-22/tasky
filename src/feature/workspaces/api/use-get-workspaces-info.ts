import { client } from "@/lib/Rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["info"]["$get"]
>;

export const useGetWorkspaceInfo = (workspaceId: string) => {
  const query = useQuery<ResponseType>({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["info"][
        "$get"
      ]({
        param: { workspaceId },
      });

      if (!response.ok) throw new Error("Failed to fetch workspace");

      return await response.json();
    },
  });

  return query;
};
