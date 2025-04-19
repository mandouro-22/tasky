export const dynamic = "force-dynamic";
import { getCurrent } from "@/feature/auth/query";
import { getWorkspaces } from "@/feature/workspaces/query";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();

  if (!user) return redirect("/sign-in");

  const workspace = await getWorkspaces();

  if (!workspace.documents?.[0]?.$id) return redirect("/workspaces/create");

  if (workspace.total === 0) return redirect("/workspaces/create");
  else return redirect(`/workspaces/${workspace.documents[0].$id}`);
}
