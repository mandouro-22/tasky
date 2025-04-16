"use client";

import { useGetWorkspaces } from "@/feature/workspaces/api/use-get-workspaces";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import WorkspaceAvatar from "./workspace-avatar";
export default function WorkspaceSwitcher() {
  const { data: workspace } = useGetWorkspaces();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xs uppercase text-neutral-500">workspaces</h1>
        <RiAddCircleFill className="size-4 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>
      <Select defaultValue={workspace?.data.documents[0]?.$id}>
        <SelectTrigger>
          <SelectValue placeholder="No Workspace Selected" />
        </SelectTrigger>
        <SelectContent>
          {workspace?.data.documents.map((workspace) => (
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
