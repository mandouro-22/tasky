import { client } from "@/lib/Rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.workspaces.$get>;

export const useGetWorkspaces = () => {
  const query = useQuery<ResponseType>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces.$get();

      if (!response.ok) throw new Error("Failed to fetch workspaces");

      return await response.json();
    },
  });

  return query;
};
