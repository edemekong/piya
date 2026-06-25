import type * as React from "react";
import { cn } from "@piya/ui";

type ProfileFieldProps = {
  label: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  suffix?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
};

type ProfileTextareaProps = {
  label: string;
  placeholder?: string;
  value?: string;
};

type ProfileSelectOption =
  | string
  | {
      label: string;
      value: string;
    };

type ProfileSelectProps = {
  label: string;
  options: ProfileSelectOption[];
  value?: string;
};

export function ProfileField({
  label,
  onChange,
  placeholder,
  suffix,
  type = "text",
  value,
}: ProfileFieldProps) {
  return (
    <label className="grid gap-2">
      <span className="text-footnote font-semibold text-[#2F4B4F]">
        {label}
      </span>
      {suffix ? (
        <span className="flex h-12 overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white">
          <input
            className="min-w-0 flex-1 bg-transparent px-3 text-callout text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40"
            defaultValue={onChange ? undefined : value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            value={onChange ? value : undefined}
          />
          {suffix}
        </span>
      ) : (
        <input
          className="h-12 rounded-sm border border-border bg-fill px-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
          defaultValue={onChange ? undefined : value}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={onChange ? value : undefined}
        />
      )}
    </label>
  );
}

export function ProfileTextarea({
  label,
  placeholder,
  value,
}: ProfileTextareaProps) {
  return (
    <label className="grid gap-2">
      <span className="text-footnote font-semibold text-[#2F4B4F]">
        {label}
      </span>
      <textarea
        className="min-h-28 rounded-sm border border-border bg-fill px-3 py-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
        defaultValue={value}
        placeholder={placeholder}
      />
    </label>
  );
}

export function ProfileSelect({ label, options, value }: ProfileSelectProps) {
  return (
    <label className="grid gap-2">
      <span className="text-footnote font-semibold text-[#2F4B4F]">
        {label}
      </span>
      <select
        className="h-12 rounded-sm border border-border bg-fill px-3 pr-10 text-callout text-[#2F4B4F] outline-none transition focus:border-primary focus:bg-white"
        defaultValue={value ?? getOptionValue(options[0])}
      >
        {options.map((option) => (
          <option key={getOptionValue(option)} value={getOptionValue(option)}>
            {getOptionLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function getOptionLabel(option: ProfileSelectOption) {
  return typeof option === "string" ? option : option.label;
}

function getOptionValue(option: ProfileSelectOption) {
  return typeof option === "string" ? option : option.value;
}

export function FieldGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>{children}</div>
  );
}
