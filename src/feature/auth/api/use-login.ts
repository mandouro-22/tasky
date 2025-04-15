import { client } from "@/lib/Rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;
type RequestType = InferRequestType<
  (typeof client.api.auth.login)["$post"]
>["json"];

export const useLogin = () => {
  const route = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.login["$post"]({ json });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login Filed");
      }

      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      route.push("/");
      toast.success("Login successfully 👍🏻");
    },

    onError: () => {
      toast.error("An error occurred while logging ❌");
    },
  });

  return mutation;
};
