import { client } from "@/lib/Rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<(typeof client.api.auth.logout)["$post"]>;

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout["$post"]();

      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.push("/sign-in");
    },
  });
  return mutation;
};
