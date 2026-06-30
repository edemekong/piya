import * as React from "react";
import { cn } from "../lib/cn";

export type EmptyStateProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  description?: React.ReactNode;
  icon?: React.ReactNode;
  title?: React.ReactNode;
};

export function EmptyState({
  children,
  className,
  description,
  icon,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-fill/40 p-6 text-callout text-[#2F4B4F]/65",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="mx-auto flex size-12 items-center justify-center rounded-md bg-secondary text-primary">
          {icon}
        </span>
      ) : null}
      {title ? (
        <p className="mt-3 text-headline font-semibold text-[#2F4B4F]">{title}</p>
      ) : null}
      {description ? (
        <p className="mt-1 max-w-sm text-callout text-[#2F4B4F]/65">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
