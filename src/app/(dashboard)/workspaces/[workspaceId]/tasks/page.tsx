import { getCurrent } from "@/feature/auth/query";
import TaskViewSwitcher from "@/feature/tasks/components/task-view-switcher";
import { redirect } from "next/navigation";
import React from "react";

export default async function TasksPage() {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");

  return (
    <div>
      <TaskViewSwitcher />
    </div>
  );
}
