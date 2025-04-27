"use client";

import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetMembers } from "@/feature/members/api/use-get-workspaces";
import { Fragment } from "react";
import MemberAvatar from "@/feature/members/components/member-avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateMember } from "@/feature/members/api/use-update-member";
import { useDeleteMember } from "@/feature/members/api/use-delete-member";
import { Member_Role } from "@/feature/members/types/type";
import useConfirm from "@/hooks/use-confirm";

export default function MembersList() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, setConfirm] = useConfirm(
    "Remove Member",
    "This member will be removed from the workspace.",
    "destructive"
  );

  const { mutate: UpdateMemberData, isPending: LoadingUpdate } =
    useUpdateMember();
  const { mutate: DeleteMemberData, isPending: LoadingDelete } =
    useDeleteMember();

  const { data } = useGetMembers({ workspaceId });

  const handleUpdateMember = (memberId: string, role: Member_Role) => {
    UpdateMemberData({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await setConfirm();
    if (!ok) return;
    DeleteMemberData({ param: { memberId } });
  };

  return (
    <Card className="border-none shadow-none w-full h-full">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-4 justify-start space-y-0">
        <Button
          variant={"secondary"}
          onClick={() => router.push(`/workspaces/${workspaceId}`)}
          size={"sm"}
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Back
        </Button>
        <CardTitle className="font-bold text-xl">Members List</CardTitle>
      </CardHeader>

      <CardContent className="p-7 md:w-2/5 md:mx-auto">
        {data?.data?.documents.map((member, index) => {
          return (
            <Fragment key={index}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MemberAvatar
                    className="size-10"
                    fallbackClassName="text-lg"
                    name={member.name}
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      className="ml-auto"
                      variant={"secondary"}
                      size={"icon"}
                      disabled={LoadingDelete || LoadingUpdate}
                    >
                      <MoreVerticalIcon className="size-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="font-medium cursor-pointer"
                      onClick={() =>
                        handleUpdateMember(member.$id, Member_Role.ADMIN)
                      }
                      disabled={LoadingDelete || LoadingUpdate}
                    >
                      Set as Administrator
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium cursor-pointer"
                      onClick={() =>
                        handleUpdateMember(member.$id, Member_Role.MEMBER)
                      }
                      disabled={LoadingDelete || LoadingUpdate}
                    >
                      Set as Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium text-amber-700 cursor-pointer"
                      onClick={() => handleDeleteMember(member.$id)}
                      disabled={LoadingDelete || LoadingUpdate}
                    >
                      Remove {member.name}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {index < data.data.documents.length - 1 && (
                <Separator className="my-2.5" />
              )}
            </Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
}
