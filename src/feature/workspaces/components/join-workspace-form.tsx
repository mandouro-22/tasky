"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { useJionWorkspace } from "../api/use-join-workspace";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useInviteCode } from "../hooks/use-invitecode-id";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
}

export default function JoinWorkspaceForm({
  initialValues,
}: JoinWorkspaceFormProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();
  const { mutate, isPending } = useJionWorkspace();

  const onSubmit = () => {
    mutate(
      {
        json: { code: inviteCode },
        param: { workspaceId: workspaceId },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data?.$id}`);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none text-center">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join{" "}
          <strong className="capitalize">{initialValues.name}</strong> workspace
        </CardDescription>
      </CardHeader>

      <div className="flex items-center flex-col lg:flex-row gap-2 justify-center pb-4">
        <Button
          size={"lg"}
          variant={"secondary"}
          className="w-full lg:w-fit"
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          size={"lg"}
          variant={"primary"}
          className="w-full lg:w-fit"
          onClick={onSubmit}
          disabled={isPending}
        >
          {isPending ? <Loader className="animate-spin" /> : "Join Workspace"}
        </Button>
      </div>
    </Card>
  );
}
