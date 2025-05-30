import { client } from "@/lib/Rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces.workspaces)["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces.workspaces)["$post"]
>["form"];

export const UseCreateWorkspaces = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const response = await client.api.workspaces.workspaces["$post"]({
        form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Create Workspace Failed");
      }
      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace created 👍🏻");
    },

    onError: () => {
      toast.error("Field to create workspace");
    },
  });

  return mutation;
};
