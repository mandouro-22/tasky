import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateProjectModel = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create_project",
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
