import { getCurrent } from "@/feature/auth/query";
import JoinWorkspaceForm from "@/feature/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/feature/workspaces/query";
import { redirect } from "next/navigation";

interface WorkspaceJoinProps {
  params: {
    workspaceId: string;
  };
}

export default async function WorkspaceIdJoinPage({
  params,
}: WorkspaceJoinProps) {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
  });

  if (!initialValues) redirect("/");

  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
}
