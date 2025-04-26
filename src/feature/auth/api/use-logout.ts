import { client } from "@/lib/Rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout["$post"]();

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout Failed");
      }

      return await response.json();
    },

    onSuccess: () => {
      router.replace("/sign-in");
      toast.success("Logout successfully 👍🏻");
      queryClient.invalidateQueries();
      queryClient.clear();
    },

    onError: () => {
      toast.error("An error occurred while logging out ❌");
    },
  });
  return mutation;
};
