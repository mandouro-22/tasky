import { client } from "@/lib/Rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.member.$get>;

interface useGetMemberProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: useGetMemberProps) => {
  const query = useQuery<ResponseType>({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await client.api.member.$get({
        query: {
          workspaceId,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch member");

      return await response.json();
    },
  });

  return query;
};
