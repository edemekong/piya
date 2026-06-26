import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../lib/cn";
import { AppText } from "./app-text";
import { Button } from "./button";

export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastNotification = {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  durationMs: number;
};

export type ToastViewportProps = {
  notifications: ToastNotification[];
  onDismiss: (id: string) => void;
  className?: string;
};

const toastIcons: Record<ToastVariant, LucideIcon> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles: Record<ToastVariant, string> = {
  success: "border-success/40 bg-white text-foreground [&_svg]:text-success",
  error: "border-error/40 bg-white text-foreground [&_svg]:text-error",
  warning: "border-warning/60 bg-white text-foreground [&_svg]:text-primary",
  info: "border-info/40 bg-white text-foreground [&_svg]:text-info",
};

function ToastItem({
  notification,
  onDismiss,
}: {
  notification: ToastNotification;
  onDismiss: (id: string) => void;
}) {
  const Icon = toastIcons[notification.variant];

  React.useEffect(() => {
    if (notification.durationMs <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onDismiss(notification.id);
    }, notification.durationMs);

    return () => window.clearTimeout(timeoutId);
  }, [notification.durationMs, notification.id, onDismiss]);

  const hasTitle = Boolean(notification.title);

  return (
    <li
      className={cn(
        "pointer-events-auto grid w-full grid-cols-[auto_1fr_auto] gap-element rounded-md border p-4 shadow-lg shadow-overlay/10",
        "transition-colors",
        hasTitle ? "items-start" : "items-center",
        toastStyles[notification.variant],
      )}
      role="status"
    >
      <Icon aria-hidden="true" className={cn("size-5", hasTitle && "mt-0.5")} />
      <div className="min-w-0">
        {hasTitle ? (
          <AppText
            as="p"
            className="break-words font-semibold text-foreground"
            variant="subheadline"
          >
            {notification.title}
          </AppText>
        ) : null}
        <AppText
          as="p"
          className={cn(
            "break-words text-text-body",
            hasTitle && "mt-1",
          )}
          variant="footnote"
        >
          {notification.message}
        </AppText>
      </div>
      <Button
        aria-label="Dismiss notification"
        className="size-8 min-w-0 rounded-full bg-transparent p-0 text-text-tertiary hover:bg-fill hover:text-foreground"
        onClick={() => onDismiss(notification.id)}
        type="button"
        variant="ghost"
      >
        <X className="size-4" />
      </Button>
    </li>
  );
}

export function ToastViewport({
  notifications,
  onDismiss,
  className,
}: ToastViewportProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <ol
      aria-live="polite"
      aria-relevant="additions removals"
      className={cn(
        "pointer-events-none fixed right-4 top-4 z-50 flex w-[min(380px,calc(100vw-32px))] flex-col gap-element",
        className,
      )}
    >
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </ol>
  );
}
