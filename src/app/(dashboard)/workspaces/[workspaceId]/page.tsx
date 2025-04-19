import { getCurrent } from "@/feature/auth/query";
import { redirect } from "next/navigation";

export default async function WorkspaceIdPage() {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");

  return <div>WorkspaceIdPage</div>;
}
