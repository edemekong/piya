import {
  AlertTriangle,
  CirclePause,
  CirclePlay,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@piya/ui";
import type { CommunicationAdminData as CommunicationData } from "@piya/shared/types";

export type CommunicationAction = "delete" | "enable" | "pause";

type CommunicationActionDialogProps = {
  action: CommunicationAction;
  communication: CommunicationData | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const actionContent = {
  delete: {
    buttonLabel: "Delete",
    description: (name: string) =>
      `Are you sure you want to delete “${name}”? This action cannot be undone.`,
    icon: Trash2,
    loadingLabel: "Deleting...",
    title: "Delete communication?",
  },
  enable: {
    buttonLabel: "Enable",
    description: (name: string) =>
      `Enable “${name}” and allow it to run when its trigger conditions are met?`,
    icon: CirclePlay,
    loadingLabel: "Enabling...",
    title: "Enable communication?",
  },
  pause: {
    buttonLabel: "Pause",
    description: (name: string) =>
      `Pause “${name}”? It will stop running until you enable it again.`,
    icon: CirclePause,
    loadingLabel: "Pausing...",
    title: "Pause communication?",
  },
} satisfies Record<
  CommunicationAction,
  {
    buttonLabel: string;
    description: (name: string) => string;
    icon: typeof Trash2;
    loadingLabel: string;
    title: string;
  }
>;

export function CommunicationActionDialog({
  action,
  communication,
  loading = false,
  onClose,
  onConfirm,
}: CommunicationActionDialogProps) {
  if (!communication) return null;

  const content = actionContent[action];
  const Icon = content.icon;
  const isDelete = action === "delete";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#102A2D]/45 p-4">
      <button
        aria-label="Close communication confirmation"
        className="absolute inset-0 cursor-default"
        disabled={loading}
        onClick={onClose}
        type="button"
      />
      <div
        aria-labelledby="communication-action-title"
        aria-modal="true"
        className="relative w-full max-w-md rounded-md bg-white p-6 text-[#2F4B4F] shadow-xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <span
            className={
              isDelete
                ? "flex size-11 shrink-0 items-center justify-center rounded-full bg-error/10 text-error"
                : "flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
            }
          >
            {isDelete ? (
              <AlertTriangle className="size-5" />
            ) : (
              <Icon className="size-5" />
            )}
          </span>
          <button
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fill transition hover:bg-secondary"
            disabled={loading}
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
        <h2
          className="mt-4 text-title-3 font-semibold text-[#2F4B4F]"
          id="communication-action-title"
        >
          {content.title}
        </h2>
        <p className="mt-2 text-callout text-[#2F4B4F]/70">
          {content.description(communication.name)}
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            disabled={loading}
            onClick={onClose}
            type="button"
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            className={
              isDelete ? "bg-error text-white hover:bg-error/90" : undefined
            }
            disabled={loading}
            icon={<Icon />}
            onClick={onConfirm}
            type="button"
          >
            {loading ? content.loadingLabel : content.buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
