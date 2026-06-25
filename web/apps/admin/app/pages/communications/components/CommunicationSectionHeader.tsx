import type * as React from "react";

type CommunicationSectionHeaderProps = {
  caption?: string;
  icon: React.ReactNode;
  title: string;
};

export function CommunicationSectionHeader({
  caption,
  icon,
  title,
}: CommunicationSectionHeaderProps) {
  return (
    <div className={`flex gap-3 ${caption ? "items-start" : "items-center"}`}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
        {icon}
      </span>
      <div>
        <h3 className="text-headline font-semibold text-[#2F4B4F]">{title}</h3>
        {caption ? (
          <p className="mt-1 text-footnote text-[#2F4B4F]/65">{caption}</p>
        ) : null}
      </div>
    </div>
  );
}
