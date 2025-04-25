import { client } from "@/lib/Rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.projects)["$post"]>;
type RequestType = InferRequestType<
  (typeof client.api.projects)["$post"]
>["form"];

export const UseCreateProject = () => {
  const router = useRouter();
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

    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created 👍🏻");
      router.push(`/workspaces/${data?.workspaceId}/projects/${data?.$id}`);
    },

    onError: () => {
      toast.error("Field to create project");
    },
  });

  return mutation;
};
