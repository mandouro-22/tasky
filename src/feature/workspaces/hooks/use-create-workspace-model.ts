import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateWorkspaceModel = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create_workspace",
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
