import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

type SelectOption =
  | string
  | {
      label: string;
      value: string;
    };

const labelClassName = "text-footnote font-normal text-[#2F4B4F]";
const inputClassName =
  "h-12 rounded-sm border border-border bg-fill px-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white";
const textareaClassName =
  "min-h-28 rounded-sm border border-border bg-fill px-3 py-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white";

function FieldLabel({
  label,
  required,
}: {
  label: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className={labelClassName}>
      {label}
      {required ? <span className="text-error"> *</span> : null}
    </span>
  );
}

export type AppTextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  className?: string;
  error?: React.ReactNode;
  inputClassName?: string;
  label: string;
  success?: React.ReactNode;
  suffix?: React.ReactNode;
};

export const AppTextField = React.forwardRef<
  HTMLInputElement,
  AppTextFieldProps
>(
  (
    {
      className,
      error,
      inputClassName: customInputClassName,
      label,
      onChange,
      required,
      success,
      suffix,
      value,
      ...props
    },
    ref
  ) => {
    const valueProps =
      onChange || value === undefined
        ? { onChange, value }
        : { defaultValue: value };

    return (
      <label className={cn("grid gap-2", className)}>
        <FieldLabel label={label} required={required} />
        {suffix ? (
          <span
            className={cn(
              "flex h-12 overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white",
              error && "border-error focus-within:border-error",
              success && !error && "border-success focus-within:border-success"
            )}
          >
            <input
              className={cn(
                "min-w-0 flex-1 bg-transparent px-3 text-callout text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40",
                customInputClassName
              )}
              ref={ref}
              required={required}
              {...valueProps}
              {...props}
            />
            {suffix}
          </span>
        ) : (
          <input
            className={cn(
              inputClassName,
              error && "border-error focus:border-error",
              success && !error && "border-success focus:border-success",
              customInputClassName
            )}
            ref={ref}
            required={required}
            {...valueProps}
            {...props}
          />
        )}
        {error ? (
          <span className="text-footnote leading-relaxed text-error">
            {error}
          </span>
        ) : success ? (
          <span className="text-footnote leading-relaxed text-success">
            {success}
          </span>
        ) : null}
      </label>
    );
  }
);

AppTextField.displayName = "AppTextField";

export type AppTextareaFieldProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
> & {
  className?: string;
  label: string;
  textareaClassName?: string;
};

export const AppTextareaField = React.forwardRef<
  HTMLTextAreaElement,
  AppTextareaFieldProps
>(
  (
    {
      className,
      label,
      onChange,
      required,
      textareaClassName: customTextareaClassName,
      value,
      ...props
    },
    ref
  ) => {
    const valueProps =
      onChange || value === undefined
        ? { onChange, value }
        : { defaultValue: value };

    return (
      <label className={cn("grid gap-2", className)}>
        <FieldLabel label={label} required={required} />
        <textarea
          className={cn(textareaClassName, customTextareaClassName)}
          ref={ref}
          required={required}
          {...valueProps}
          {...props}
        />
      </label>
    );
  }
);

AppTextareaField.displayName = "AppTextareaField";

export type AppSelectFieldProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "className"
> & {
  className?: string;
  label: string;
  options: readonly SelectOption[];
  selectClassName?: string;
};

export function AppSelectField({
  className,
  label,
  onChange,
  options,
  required,
  selectClassName,
  value,
  ...props
}: AppSelectFieldProps) {
  const fallbackValue = value ?? getOptionValue(options[0]);
  const valueProps = onChange
    ? { onChange, value: fallbackValue }
    : { defaultValue: fallbackValue };

  return (
    <label className={cn("grid gap-2", className)}>
      <FieldLabel label={label} required={required} />
      <span className="relative">
        <select
          className={cn(
            inputClassName,
            "w-full appearance-none pr-12",
            selectClassName
          )}
          required={required}
          {...valueProps}
          {...props}
        >
          {options.map((option) => (
            <option key={getOptionValue(option)} value={getOptionValue(option)}>
              {getOptionLabel(option)}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/55"
        />
      </span>
    </label>
  );
}

export function AppFieldGrid({
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

function getOptionLabel(option: SelectOption) {
  return typeof option === "string" ? option : option.label;
}

function getOptionValue(option: SelectOption) {
  return typeof option === "string" ? option : option.value;
}
