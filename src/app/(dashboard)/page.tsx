import { getCurrent } from "@/feature/auth/action";
import CreateWorkSpacesForm from "@/feature/workspaces/components/create-workspaces-form";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrent();

  if (!user) return redirect("/sign-in");

  return (
    <div className="border border-gray-700  bg-gray-400">
      <CreateWorkSpacesForm />
    </div>
  );
}
