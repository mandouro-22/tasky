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
  CreateWorkspacesSchema,
  inferCreateWorkspacesSchema,
} from "@/validations/workspaces/workspaces_schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UseCreateWorkspaces } from "../api/use-create-workspace";
import { Loader } from "lucide-react";

interface CreateWorkspacesFormProps {
  onCancel?: () => void;
}

export default function CreateWorkSpacesForm({
  onCancel,
}: CreateWorkspacesFormProps) {
  const { mutate, isPending } = UseCreateWorkspaces();

  const form = useForm<inferCreateWorkspacesSchema>({
    resolver: zodResolver(CreateWorkspacesSchema),
    defaultValues: { name: "" },
  });

  const onSubmit = (data: inferCreateWorkspacesSchema) => {
    console.log(data);
    mutate(data);
    console.log(onCancel);
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle>Create a new workspace</CardTitle>
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

            <div className="flex items-center justify-between gap-3 space-y-6">
              <Button
                type="button"
                variant={"outline"}
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button disabled={isPending}>
                {isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Create Workspace"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
