import type * as React from "react";

type FieldProps = {
  label: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
};

export function Field({ label, placeholder, type = "text" }: FieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-footnote font-semibold text-[#2F4B4F]">{label}</span>
      <input
        className="h-12 rounded-sm border border-border bg-fill px-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}
