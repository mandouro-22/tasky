import { getCurrent } from "@/feature/auth/query";
import { redirect } from "next/navigation";
import React from "react";
import ClientPage from "./client";

export default async function TaskIdPage() {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");
  return <ClientPage />;
}
