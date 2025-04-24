import EditProjectForm from "@/feature/projects/components/edit-project-form";
import { getProject } from "@/feature/projects/queries";

interface ProjectIdSettingsProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectIdSettings({
  params,
}: ProjectIdSettingsProps) {
  const initialValues = await getProject({ projectId: params.projectId });

  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <EditProjectForm initialValue={initialValues} />
    </div>
  );
}
