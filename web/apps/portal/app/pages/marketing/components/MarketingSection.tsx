import { cn } from "@piya/ui";
import type * as React from "react";

type MarketingSectionProps = {
  children: React.ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function MarketingSection({
  children,
  className,
  description,
  eyebrow,
  title,
}: MarketingSectionProps) {
  return (
    <section className={cn("border-t border-border bg-background", className)}>
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-20">
        {(eyebrow || title || description) && (
          <div className="mb-8 max-w-3xl">
            {eyebrow && (
              <p className="text-subheadline font-semibold text-primary">{eyebrow}</p>
            )}
            {title && (
              <h2 className="mt-3 text-title-1 font-semibold text-[#2F4B4F]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 text-callout leading-7 text-text-secondary">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
