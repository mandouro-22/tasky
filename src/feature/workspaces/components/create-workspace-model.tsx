"use client";
import { ResponsiveModel } from "@/components/responsive/responsive-model";
import CreateWorkSpacesForm from "./create-workspaces-form";
import { useCreateWorkspaceModel } from "../hooks/use-create-workspace-model";

export function CreateWorkspaceModel() {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModel();
  return (
    <ResponsiveModel open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkSpacesForm onCancel={close} />
    </ResponsiveModel>
  );
}
