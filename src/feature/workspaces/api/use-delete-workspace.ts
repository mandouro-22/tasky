import { client } from "@/lib/Rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

export function useDeleteWorkspace() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$delete"]({
        param,
      });

      return await response.json();
    },

    onSuccess: ({ data }) => {
      toast.success("Workspace Deleted Successfully");
      router.push("/");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data?.$id] });
    },

    onError: () => {
      toast.error("Failed to delete workspace");
    },
  });

  return mutation;
}
