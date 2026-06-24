import * as React from "react";
import { cn } from "../lib/cn";

export type AppAvatarProps = React.HTMLAttributes<HTMLSpanElement> & {
  imageUrl?: string | null;
  name: string;
};

export function AppAvatar({ className, imageUrl, name, ...props }: AppAvatarProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-white",
        className,
      )}
      {...props}
    >
      {imageUrl ? (
        <img
          alt=""
          className="size-full rounded-full object-cover"
          src={imageUrl}
        />
      ) : (
        name.charAt(0)
      )}
    </span>
  );
}
