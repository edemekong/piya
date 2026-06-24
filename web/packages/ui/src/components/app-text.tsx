import * as React from "react";
import { cn } from "../lib/cn";
import type { AppTextVariant } from "../theme/typography";

const textVariants: Record<AppTextVariant, string> = {
  largeTitle: "text-large-title",
  title1: "text-title-1",
  title2: "text-title-2",
  title3: "text-title-3",
  headline: "text-headline",
  body: "text-body",
  callout: "text-callout",
  subheadline: "text-subheadline",
  footnote: "text-footnote",
  caption1: "text-caption-1",
  caption2: "text-caption-2",
  micro: "text-micro",
};

export type AppTextProps<TElement extends React.ElementType = "p"> = {
  as?: TElement;
  variant?: AppTextVariant;
  center?: boolean;
} & Omit<React.ComponentPropsWithoutRef<TElement>, "as">;

export function AppText<TElement extends React.ElementType = "p">({
  as,
  variant = "body",
  center = false,
  className,
  ...props
}: AppTextProps<TElement>) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(
        textVariants[variant],
        center && "text-center",
        className,
      )}
      {...props}
    />
  );
}
