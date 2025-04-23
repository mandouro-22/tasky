"use client";
import { useState } from "react";
import { Task, TasksStatus } from "../../type";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import KanbanColumnHeader from "./kanban-column-header";
import KanbanCard from "./kanban-card";

const boards: TasksStatus[] = [
  TasksStatus.BACKLOG,
  TasksStatus.TODO,
  TasksStatus.IN_PROGRESS,
  TasksStatus.IN_REVIEW,
  TasksStatus.DONE,
];

type TaskStatus = {
  [key in TasksStatus]: Task[];
};

interface DataKanbanProps {
  data: Task[];
}

export const DataKanban = ({ data }: DataKanbanProps) => {
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
  console.log(setTasks);
  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex overflow-x-auto">
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
