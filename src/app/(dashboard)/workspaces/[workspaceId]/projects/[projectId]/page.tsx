import { getCurrent } from "@/feature/auth/query";
import { redirect } from "next/navigation";
import React from "react";
import ProjectIdClient from "./client";

export default async function ProjectIdPage() {
  const user = await getCurrent();

  if (!user) {
    return redirect("/sign-in");
  }

  return <ProjectIdClient />;
}
