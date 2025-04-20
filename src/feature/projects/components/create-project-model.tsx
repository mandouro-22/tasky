"use client";
import { ResponsiveModel } from "@/components/responsive/responsive-model";
import { useCreateProjectModel } from "../hooks/use-create-projects-model";
import CreateProjectsForm from "./create-project-form";

export function CreateProjectModel() {
  const { isOpen, setIsOpen, close } = useCreateProjectModel();
  return (
    <ResponsiveModel open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectsForm onCancel={close} />
    </ResponsiveModel>
  );
}
