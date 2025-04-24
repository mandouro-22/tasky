"use client";

import { useGetWorkspaces } from "@/feature/workspaces/api/use-get-workspaces";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import WorkspaceAvatar from "./workspace-avatar";
import { useRouter } from "next/navigation";
import { useCreateWorkspaceModel } from "@/feature/workspaces/hooks/use-create-workspace-model";
export default function WorkspaceSwitcher() {
  const { open } = useCreateWorkspaceModel();
  const { data: workspace } = useGetWorkspaces();
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const onSelected = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xs uppercase text-neutral-500">Workspaces</h1>
        <RiAddCircleFill
          className="size-4 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          onClick={open}
        />
      </div>
      <Select onValueChange={onSelected} value={workspaceId}>
        <SelectTrigger>
          <SelectValue placeholder="No Workspace Selected" />
        </SelectTrigger>
        <SelectContent>
          {workspace?.data?.documents?.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex justify-start items-center gap-3 font-medium !rounded-lg">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.imageUrl}
                />
                <span>{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
