import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@piya/ui";

type CatalogDeleteDialogProps = {
  deleting?: boolean;
  itemName: string;
  itemType: "discount" | "gift" | "offering";
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
};

export function CatalogDeleteDialog({
  deleting = false,
  itemName,
  itemType,
  onClose,
  onConfirm,
  open,
}: CatalogDeleteDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#102A2D]/45 p-4">
      <button
        aria-label="Close delete confirmation"
        className="absolute inset-0 cursor-default"
        disabled={deleting}
        onClick={onClose}
        type="button"
      />
      <div
        aria-labelledby="catalog-delete-title"
        aria-modal="true"
        className="relative w-full max-w-md rounded-md bg-white p-6 text-[#2F4B4F] shadow-xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
            <AlertTriangle className="size-5" />
          </span>
          <button
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fill transition hover:bg-secondary"
            disabled={deleting}
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
        <h2
          className="mt-4 text-title-3 font-semibold text-[#2F4B4F]"
          id="catalog-delete-title"
        >
          Delete {itemType}?
        </h2>
        <p className="mt-2 text-callout text-[#2F4B4F]/70">
          Are you sure you want to delete “{itemName}”? This action cannot be
          undone.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            disabled={deleting}
            onClick={onClose}
            type="button"
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            className="bg-error text-white hover:bg-error/90"
            disabled={deleting}
            icon={<Trash2 />}
            onClick={onConfirm}
            type="button"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
