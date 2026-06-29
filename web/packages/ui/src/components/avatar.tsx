import * as React from "react";
import { cn } from "../lib/cn";

export type AppAvatarProps = React.HTMLAttributes<HTMLSpanElement> & {
  imageUrl?: string | null;
  name: string;
};

export function AppAvatar({
  className,
  imageUrl,
  name,
  style,
  ...props
}: AppAvatarProps) {
  const fallbackStyle = imageUrl
    ? style
    : {
        ...style,
        backgroundColor: getAvatarColor(name),
      };

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        className,
      )}
      style={fallbackStyle}
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

function getAvatarColor(name: string) {
  const normalizedName = name.trim().toLocaleLowerCase();
  let hash = 0;

  for (let index = 0; index < normalizedName.length; index += 1) {
    hash = (hash * 31 + normalizedName.charCodeAt(index)) % 360;
  }

  return `hsl(${hash} 58% 42%)`;
}
