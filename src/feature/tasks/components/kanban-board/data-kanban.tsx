"use client";
import { useCallback, useEffect, useState } from "react";
import { Task, TasksStatus } from "../../type";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import KanbanColumnHeader from "./kanban-column-header";
import KanbanCard from "./kanban-card";

const boards: TasksStatus[] = [
  TasksStatus.BACKLOG,
  TasksStatus.TODO,
  TasksStatus.IN_PROGRESS,
  TasksStatus.IN_REVIEW,
  TasksStatus.DONE,
];

export type TaskStatus = {
  [key in TasksStatus]: Task[];
};

interface DataKanbanProps {
  data: Task[];
  onChange: (
    tasks: {
      $id: string;
      status: TaskStatus;
      position: number;
    }[]
  ) => void;
}

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TaskStatus>(() => {
    const initialTasks: TaskStatus = {
      [TasksStatus.BACKLOG]: [],
      [TasksStatus.TODO]: [],
      [TasksStatus.IN_PROGRESS]: [],
      [TasksStatus.IN_REVIEW]: [],
      [TasksStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status as TasksStatus].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TasksStatus].sort(
        (a, b) => a.position - b.position
      );
    });

    return initialTasks;
  });

  useEffect(() => {
    const initialTasks: TaskStatus = {
      [TasksStatus.BACKLOG]: [],
      [TasksStatus.TODO]: [],
      [TasksStatus.IN_PROGRESS]: [],
      [TasksStatus.IN_REVIEW]: [],
      [TasksStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status as TasksStatus].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TasksStatus].sort(
        (a, b) => a.position - b.position
      );
    });

    setTasks(initialTasks);
  }, [data]);

  const calculatePosition = (index: number, step = 1000, max = 1_000_000) =>
    Math.min((index + 1) * step, max);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return null;
      const sourceStatus = result.source.droppableId as TasksStatus;
      const destStatus = result.destination.droppableId as TasksStatus;

      let updatesPayload: {
        $id: string;
        status: TasksStatus;
        position: number;
      }[] = [];

      setTasks((prevTasks) => {
        const newTask = { ...prevTasks };

        // Safe remove the task from the source column
        const sourceColumn = [...newTask[sourceStatus]];
        const [moveTask] = sourceColumn.splice(result.source.index, 1);

        if (!moveTask) {
          console.error("No Task Found at the source index");
          return prevTasks;
        }

        // Create a new task object with potentially update status
        const updateTask =
          sourceStatus !== destStatus
            ? { ...moveTask, status: destStatus }
            : moveTask;

        // Update the source column
        newTask[sourceStatus] = sourceColumn;

        // Insert the task into its new position in the destination column
        const destColumn = [...newTask[destStatus]];
        if (
          result?.destination &&
          typeof result.destination.index === "number"
        ) {
          destColumn.splice(result.destination.index, 0, updateTask);
        }
        newTask[destStatus] = destColumn;

        // prepare minimal update payloads
        updatesPayload = [];

        // Always update the moved task
        updatesPayload.push({
          $id: updateTask.$id,
          status: destStatus,
          position: calculatePosition(result?.destination?.index ?? 0),
        });

        // Update Position for affected tasks in the destination column
        newTask[destStatus].forEach((task, index) => {
          if (task && task.$id === updateTask.$id) {
            const newPosition = calculatePosition(index);

            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: destStatus,
                position: newPosition,
              });
            }
          }
        });

        // If the task moved between columns, update position in the source column.
        if (sourceStatus !== destStatus) {
          newTask[sourceStatus].forEach((task, index) => {
            if (task) {
              const newPosition = calculatePosition(index);
              if (task.position !== newPosition) {
                updatesPayload.push({
                  $id: task.$id,
                  status: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }

        return newTask;
      });

      onChange(
        updatesPayload as unknown as {
          $id: string;
          status: TaskStatus;
          position: number;
        }[]
      );
    },
    [onChange]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto mt-5">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="py-1.5 min-h-[200px]"
                    >
                      {tasks[board].map((task, index) => (
                        <Draggable
                          draggableId={task.$id}
                          index={index}
                          key={index}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <KanbanCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
