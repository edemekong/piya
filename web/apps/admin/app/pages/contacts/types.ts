export type AddContactMode = "manual" | "csv";

export type AddContactSheetProps = {
  mode: AddContactMode;
  onClose: () => void;
  onModeChange: (mode: AddContactMode) => void;
  open: boolean;
};
