import React, { useState } from "react";
import { Task } from "../type";
import { Button } from "@/components/ui/button";
import { PencilIcon, XIcon } from "lucide-react";
import DottedSeparatoo from "@/components/dotted-separator";
import { useEditTask } from "../api/use-edit-task";
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionProps {
  task: Task;
}

export default function TaskDescription({ task }: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, isValue] = useState(task.description);

  const { mutate, isPending } = useEditTask();

  const handleUpdateDescription = () => {
    mutate({
      json: { description: value },
      param: { taskId: task.$id },
    });
  };

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            variant={"secondary"}
            size={"sm"}
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? (
              <>
                <XIcon className="size-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <PencilIcon className="size-4 mr-1" />
                Edit Task
              </>
            )}
          </Button>
        </div>
        <DottedSeparatoo className="my-4" />
        <div className="flex flex-col gap-y-4">
          {isEditing ? (
            <div className="flex flex-col gap-3">
              <Textarea
                placeholder="Add a description..."
                value={value}
                rows={4}
                onChange={(e) => isValue(e.target.value)}
                disabled={isPending}
              />

              <Button
                size={"sm"}
                onClick={handleUpdateDescription}
                disabled={isPending}
                className="ml-auto"
              >
                {isPending ? "Saving..." : "Save change"}
              </Button>
            </div>
          ) : (
            <div>
              {task.description || (
                <span className="text-muted-foreground">
                  No description set
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
