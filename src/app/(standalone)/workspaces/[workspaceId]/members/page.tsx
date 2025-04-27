import { getCurrent } from "@/feature/auth/query";
import MembersList from "@/feature/workspaces/components/members-list";
import { redirect } from "next/navigation";

export default async function MembersPage() {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-screen-xl mx-auto">
      <MembersList />
    </div>
  );
}
