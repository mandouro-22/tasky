import { getCurrent } from "@/feature/auth/query";
import CreateWorkSpacesForm from "@/feature/workspaces/components/create-workspaces-form";
import { redirect } from "next/navigation";
import React from "react";

export default async function CreateWorkspacePage() {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl mx-auto space-y-8">
      <CreateWorkSpacesForm />
    </div>
  );
}
