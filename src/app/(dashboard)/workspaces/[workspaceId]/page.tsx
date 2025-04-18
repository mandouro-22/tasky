import { getCurrent } from "@/feature/auth/action";
import { redirect } from "next/navigation";

export default async function WorkspaceIdPage() {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");

  return <div>WorkspaceIdPage</div>;
}
