import { useParams } from "next/navigation";

export const useTaskId = () => {
  const param = useParams();
  return param.taskId as string;
};
