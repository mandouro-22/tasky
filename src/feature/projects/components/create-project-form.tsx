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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UseCreateProject } from "../api/use-create-project";
import { ImageIcon, Loader } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CreatePrjectSchemaType,
  CreateProjectSchema,
} from "@/validations/projects/project-schema";
import { useWorkspaceId } from "@/feature/workspaces/hooks/use-workspace-id";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export default function CreateProjectsForm({
  onCancel,
}: CreateProjectFormProps) {
  const { mutate, isPending } = UseCreateProject();
  const inputRef = useRef<HTMLInputElement>(null);
  const workspaceId = useWorkspaceId();

  // const router = useRouter();

  const form = useForm<CreatePrjectSchemaType>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: { name: "", workspaceId: "" },
  });

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("imageUrl", file);
    }
  };

  const onSubmit = (data: CreatePrjectSchemaType) => {
    const finalData = {
      ...data,
      imageUrl: data.imageUrl instanceof File ? data.imageUrl : "",
      workspaceId,
    };

    mutate(finalData, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle>Create a new Project</CardTitle>
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
                      placeholder="Enter your Project"
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
                      <p className="text-sm">Project Icon</p>
                      <p className="text-xs text-muted-foreground">
                        Upload a project icon. (PNG, JPG, svg, JPEG), max 1mb
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
                variant={"outline"}
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button disabled={isPending}>
                {isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Create Project"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
