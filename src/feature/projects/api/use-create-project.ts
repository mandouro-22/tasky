import { client } from "@/lib/Rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.projects)["$post"]>;
type RequestType = InferRequestType<
  (typeof client.api.projects)["$post"]
>["form"];

export const UseCreateProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (form) => {
      const response = await client.api.projects["$post"]({
        form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Create Project Failed");
      }
      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created 👍🏻");
    },

    onError: () => {
      toast.error("Field to create project");
    },
  });

  return mutation;
};
