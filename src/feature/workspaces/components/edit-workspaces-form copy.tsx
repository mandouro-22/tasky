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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, ImageIcon, Loader } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Workspace } from "../type";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useRouter } from "next/navigation";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValue: Workspace;
}

export default function EditWorkspaceForm({
  onCancel,
  initialValue,
}: EditWorkspaceFormProps) {
  const { mutate, isPending } = useUpdateWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<inferUpdateWorkspacesSchema>({
    resolver: zodResolver(UpdateWorkspacesSchema),
    defaultValues: {
      ...initialValue,
      imageUrl: initialValue.imageUrl,
    },
  });

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

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex flex-grow gap-x-4 p-7 space-y-0">
        <CardTitle>{initialValue.name}</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparatoo />
      </div>

      <CardContent className="py7">
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
                        Upload a workspace icon. (PNG, JPG, svg, JPEG), max 2mb
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
                          className="mt-2 w-full"
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
                          className="mt-2 w-full"
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
  );
}
