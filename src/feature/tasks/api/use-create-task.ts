import { client } from "@/lib/Rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.tasks)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)["$post"]>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({
      json: { status, name, workspaceId, projectId, assigneeId, dueDate },
    }) => {
      const response = await client.api.tasks["$post"]({
        json: {
          status,
          name,
          workspaceId,
          projectId,
          assigneeId,
          dueDate,
        },
      });
      return await response.json();
    },
    onSuccess: ({ data }) => {
      router.prefetch(
        `/workspaces/${data?.workspaceId}/projects/${data?.projectId}`
      );
      toast.success("Added Task Successfully");
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      router.push(
        `/workspaces/${data?.workspaceId}/projects/${data?.projectId}`
      );
    },

    onError: () => {
      toast.error("Failed to create task");
    },
  });

  return mutation;
};
