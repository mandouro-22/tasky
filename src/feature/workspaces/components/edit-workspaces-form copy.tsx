"use client";

import DottedSeparatoo from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UpdateWorkspacesSchema,
  inferUpdateWorkspacesSchema,
} from "@/validations/workspaces/workspaces_schema";
import useConfirm from "@/hooks/use-confirm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, CopyIcon, ImageIcon, Loader } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Workspace } from "../type";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useRouter } from "next/navigation";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { toast } from "sonner";
import { useUpdateInviteCodeWorkspace } from "../api/use-update-invaite-code-workspace";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValue: Workspace;
}

export default function EditWorkspaceForm({
  onCancel,
  initialValue,
}: EditWorkspaceFormProps) {
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: DeleteWorkspaceLoading } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: ResetInviteCodeLoading } =
    useUpdateInviteCodeWorkspace();
  const [DeleteDialog, confirmDialog] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone.",
    "destructive"
  );
  const [ResetDialog, confirmReset] = useConfirm(
    "Reset invite code",
    "This will invalidate the current invite link.",
    "destructive"
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<inferUpdateWorkspacesSchema>({
    resolver: zodResolver(UpdateWorkspacesSchema),
    defaultValues: {
      ...initialValue,
      imageUrl: initialValue.imageUrl,
    },
  });

  const handleDeleteWorkspace = async () => {
    const ok = await confirmDialog();
    if (!ok) return;

    deleteWorkspace(
      {
        param: {
          workspaceId: initialValue.$id,
        },
      },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) return;

    resetInviteCode(
      {
        param: {
          workspaceId: initialValue.$id,
        },
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("imageUrl", file);
    }
  };

  const onSubmit = (data: inferUpdateWorkspacesSchema) => {
    const finalData = {
      ...data,
      imageUrl: data.imageUrl instanceof File ? data.imageUrl : "",
    };

    mutate(
      { form: finalData, param: { workspaceId: initialValue.$id } },
      {
        onSuccess: (data) => {
          form.reset();
          router.push(`/workspaces/${data?.data?.$id}`);
        },
      }
    );
  };

  const fullInviteCode = `${window.location.origin}/workspaces/${initialValue.$id}/join/${initialValue.inviteCode}`;

  const handleInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteCode)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  return (
    <div className="flex flex-col gap-y-4 w-full sm:w-fit mx-auto">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-grow gap-x-4 p-7 max-sm:!px-0 space-y-0">
          <CardTitle>{initialValue.name}</CardTitle>
        </CardHeader>

        <div className="px-7 max-sm:!px-0">
          <DottedSeparatoo />
        </div>

        <CardContent className="py-7 max-sm:!px-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label>Name</Label>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your workspace"
                        disabled={isPending}
                        {...field}
                        className="text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="imageUrl"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <div className="flex gap-4">
                      {field.value ? (
                        <Image
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : field.value || ""
                          }
                          width={73}
                          height={73}
                          alt="Workspace Image"
                          className="object-cover size-[73px] rounded-md"
                        />
                      ) : (
                        <Avatar className="size-[73px]">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-500" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="flex flex-col">
                        <p className="text-sm">Workspace Icon</p>
                        <p className="text-xs text-muted-foreground">
                          Upload a workspace icon. (PNG, JPG, svg, JPEG), max
                          2mb
                        </p>

                        <Input
                          type="file"
                          accept=".jpg, .jpeg, .png, .svg"
                          className="hidden"
                          ref={inputRef}
                          onChange={handleChangeImage}
                          disabled={isPending}
                        />

                        {field.value ? (
                          <Button
                            type="button"
                            variant={"destructive"}
                            className="mt-2 w-full text-sm"
                            onClick={() => {
                              field.onChange(null);
                              if (inputRef.current) {
                                inputRef.current.value = "";
                              }
                            }}
                            disabled={isPending}
                          >
                            Remove Image
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant={"outline"}
                            className="mt-2 w-full text-sm"
                            onClick={() => inputRef.current?.click()}
                            disabled={isPending}
                          >
                            Update Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between gap-3 my-4">
                <Button
                  type="button"
                  variant={"secondary"}
                  onClick={
                    onCancel
                      ? onCancel
                      : () => router.push(`/workspaces/${initialValue.$id}`)
                  }
                  disabled={isPending}
                >
                  <ArrowLeft />
                  Back
                </Button>
                <Button disabled={isPending}>
                  {isPending ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Update Workspace"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="py-7 max-sm:!px-0">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Code</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>

            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteCode} />
                <Button
                  onClick={handleInviteLink}
                  variant={"secondary"}
                  size={"xs"}
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>

            <Button
              type="button"
              variant={"destructive"}
              className="mt-2 w-fit ml-auto"
              disabled={isPending || ResetInviteCodeLoading}
              onClick={handleResetInviteCode}
            >
              Reset Invite Code
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="py-7 max-sm:!px-0">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated
            </p>
            <Button
              type="button"
              variant={"destructive"}
              className="mt-2 w-fit ml-auto"
              disabled={isPending || DeleteWorkspaceLoading}
              onClick={handleDeleteWorkspace}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
