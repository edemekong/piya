import * as React from "react";
import { cn } from "../lib/cn";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-md border border-border bg-background px-2.5 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
