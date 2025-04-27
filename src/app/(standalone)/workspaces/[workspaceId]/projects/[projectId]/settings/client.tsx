"use client";

import ErrorPage from "@/components/error/error";
import LoadingPage from "@/components/loading/Loading";
import { useGetProject } from "@/feature/projects/api/use-get-proejcts-by-id";
import EditProjectForm from "@/feature/projects/components/edit-project-form";
import { useProjectId } from "@/feature/projects/hooks/use-project-id";
import { Project } from "@/feature/projects/type";

export default function SettingPorject() {
  const projectId = useProjectId();
  const { data: initialValues, isLoading } = useGetProject({ projectId });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!initialValues) {
    return <ErrorPage message="Project not found" />;
  }

  return (
    <div className="w-full lg:max-w-screen-xl mx-auto rounded-lg">
      <EditProjectForm initialValue={initialValues.data as Project} />
    </div>
  );
}
