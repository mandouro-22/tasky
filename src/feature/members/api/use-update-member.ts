import { client } from "@/lib/Rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.member)[":memberId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.member)[":memberId"]["$patch"]
>;

export function useUpdateMember() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.member[":memberId"]["$patch"]({
        json,
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to update member");
      }

      return await response.json();
    },

    onSuccess: () => {
      toast.success("Member Updated Successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },

    onError: () => {
      toast.error("Failed to update member");
    },
  });

  return mutation;
}
