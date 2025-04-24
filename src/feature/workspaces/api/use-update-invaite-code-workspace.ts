import { client } from "@/lib/Rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["reset_inviteCode"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["reset_inviteCode"]["$post"]
>;

export function useUpdateInviteCodeWorkspace() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"][
        "reset_inviteCode"
      ]["$post"]({
        param,
      });

      return await response.json();
    },

    onSuccess: ({ data }) => {
      toast.success("Workspace reset invite code");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data?.$id] });
    },

    onError: () => {
      toast.error("Failed to reset invite code");
    },
  });

  return mutation;
}
