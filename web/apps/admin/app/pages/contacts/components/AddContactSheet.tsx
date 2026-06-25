import { CheckCircle2, Upload, X } from "lucide-react";
import { Button, cn } from "@yinapp/ui";
import { Field } from "@/components/inputs";
import type { AddContactMode } from "../types";

type AddContactSheetProps = {
  mode: AddContactMode;
  onClose: () => void;
  onModeChange: (mode: AddContactMode) => void;
  open: boolean;
};

export function AddContactSheet({
  mode,
  onClose,
  onModeChange,
  open,
}: AddContactSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#102A2D]/45">
      <button
        aria-label="Close add contact sheet"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <aside className="relative flex h-full w-full max-w-xl flex-col bg-white text-[#2F4B4F] shadow-xl">
        <div className="flex items-start justify-between border-b border-border p-6">
          <div>
            <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
              Add contact
            </h2>
            <p className="mt-1 text-callout text-[#2F4B4F]/70">
              Create one contact manually or upload a CSV file.
            </p>
          </div>
          <button
            aria-label="Close"
            className="flex size-10 items-center justify-center rounded-full bg-fill text-[#2F4B4F] hover:bg-secondary"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b border-border px-6 py-4">
          <div className="grid grid-cols-2 rounded-md bg-fill p-1">
            <ModeButton active={mode === "manual"} onClick={() => onModeChange("manual")}>
              Manual
            </ModeButton>
            <ModeButton active={mode === "csv"} onClick={() => onModeChange("csv")}>
              CSV
            </ModeButton>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {mode === "manual" ? <ManualContactForm /> : <CsvContactForm />}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border p-6">
          <Button
            className="bg-fill text-[#2F4B4F] hover:bg-fill-secondary"
            onClick={onClose}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button icon={mode === "csv" ? <Upload /> : <CheckCircle2 />}>
            {mode === "csv" ? "Import contacts" : "Save contact"}
          </Button>
        </div>
      </aside>
    </div>
  );
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-sm px-4 py-2 text-callout font-semibold transition",
        active ? "bg-white text-[#2F4B4F] shadow-sm" : "text-[#2F4B4F]/65",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ManualContactForm() {
  return (
    <form className="grid gap-4">
      <Field label="Full name" placeholder="e.g. Ada Johnson" />
      <Field label="Email address" placeholder="ada@example.com" type="email" />
      <Field label="Phone number" placeholder="+234 800 000 0000" />
      <Field label="Country code" placeholder="e.g. NG" />
      <Field label="Tags" placeholder="e.g. vip, high value" />
      <label className="grid gap-2">
        <span className="text-footnote font-semibold text-[#2F4B4F]">Address</span>
        <textarea
          className="min-h-28 rounded-sm border border-border bg-fill px-3 py-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
          placeholder="Add customer address"
        />
      </label>
    </form>
  );
}

function CsvContactForm() {
  return (
    <div className="grid gap-5">
      <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-primary bg-fill px-6 py-10 text-center transition hover:bg-secondary/30">
        <Upload className="size-9 text-primary" />
        <span className="mt-4 text-headline font-semibold text-[#2F4B4F]">
          Upload CSV file
        </span>
        <span className="mt-2 max-w-sm text-callout text-[#2F4B4F]/65">
          Use columns for name, email, phone number, country code, and tags.
        </span>
        <input accept=".csv,text/csv" className="sr-only" type="file" />
      </label>

      <div className="rounded-md border border-border bg-fill p-4">
        <p className="text-headline font-semibold text-[#2F4B4F]">CSV format</p>
        <p className="mt-2 text-callout text-[#2F4B4F]/70">
          Required columns: name and either email or phone number. Optional columns: country code, status, and tags.
        </p>
      </div>
    </div>
  );
}
