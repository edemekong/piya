import type { HTMLInputTypeAttribute } from "react";
import { AppTextField } from "@piya/ui";

type FieldProps = {
  label: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
};

export function Field({ label, placeholder, type = "text" }: FieldProps) {
  return <AppTextField label={label} placeholder={placeholder} type={type} />;
}
