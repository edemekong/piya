import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../lib/cn";

export type AppSheetProps = {
  ariaLabel?: string;
  bodyClassName?: string;
  children: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  maxWidthClassName?: string;
  onClose: () => void;
  open: boolean;
  title?: React.ReactNode;
};

export function AppSheet({
  ariaLabel,
  bodyClassName,
  children,
  className,
  description,
  footer,
  header,
  maxWidthClassName = "max-w-xl",
  onClose,
  open,
  title,
}: AppSheetProps) {
  if (!open) return null;

  const closeLabel = ariaLabel ? `Close ${ariaLabel}` : "Close sheet";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#102A2D]/45">
      <button
        aria-label={closeLabel}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-label={ariaLabel}
        className={cn(
          "relative flex h-full w-full flex-col bg-white text-[#2F4B4F] shadow-xl",
          maxWidthClassName,
          className,
        )}
      >
        {header ?? (
          <div className="flex items-start justify-between gap-4 border-b border-border p-6">
            <div>
              {title ? (
                <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="mt-1 text-callout text-[#2F4B4F]/70">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              aria-label="Close"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fill text-[#2F4B4F] hover:bg-secondary"
              onClick={onClose}
              type="button"
            >
              <X className="size-5" />
            </button>
          </div>
        )}

        <div className={cn("flex-1 overflow-y-auto p-6", bodyClassName)}>
          {children}
        </div>

        {footer ? (
          <div className="flex items-center justify-end gap-3 border-t border-border p-6">
            {footer}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
