export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { getCurrent } from "@/feature/auth/query";
import { getWorkspaces } from "@/feature/workspaces/query";
import { redirect } from "next/navigation";

export default async function Home() {
  console.log("===> [Dashboard] Trying to fetch current user...");

  const user = await getCurrent();
  console.log("===> [Dashboard] Current user:", user);

  if (!user) {
    console.log("===> [Dashboard] No user found, redirecting to /sign-in");
    return redirect("/sign-in");
  }

  console.log("===> [Dashboard] Fetching workspaces...");
  const workspace = await getWorkspaces();
  console.log("===> [Dashboard] Workspaces fetched:", workspace);

  if (!workspace.documents?.[0]?.$id || workspace.total === 0) {
    console.log(
      "===> [Dashboard] No workspace found, redirecting to /workspaces/create"
    );
    return redirect("/workspaces/create");
  }

  console.log(
    `===> [Dashboard] Redirecting to /workspaces/${workspace.documents[0].$id}`
  );
  return redirect(`/workspaces/${workspace.documents[0].$id}`);
}
