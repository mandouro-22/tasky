import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateTasksModel = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create_tasks",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    open,
    isOpen,
    close,
    setIsOpen,
  };
};
