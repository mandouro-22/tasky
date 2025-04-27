import { client } from "@/lib/Rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.member)[":memberId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.member)[":memberId"]["$delete"]
>;

export function useDeleteMember() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.member[":memberId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete member");
      }

      return await response.json();
    },

    onSuccess: () => {
      toast.success("Member Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },

    onError: () => {
      toast.error("Failed to delete member");
    },
  });

  return mutation;
}
