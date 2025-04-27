import { client } from "@/lib/Rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["reset_inviteCode"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["reset_inviteCode"]["$post"]
>;

export function useUpdateInviteCodeWorkspace() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"][
        "reset_inviteCode"
      ]["$post"]({
        param,
      });

      if (!response.ok) throw new Error("Failed to reset invite code");

      return await response.json();
    },

    onSuccess: ({ data }) => {
      toast.success("Workspace reset invite code");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data?.$id] });
    },

    onError: () => {
      toast.error("Failed to reset invite code");
    },
  });

  return mutation;
}
