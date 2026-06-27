import * as React from "react";
import { Upload } from "lucide-react";

type UploadFieldSuffixProps = {
  accept: string;
  label: string;
  onSelect: (file: File) => void;
};

function UploadFieldSuffix({
  accept,
  label,
  onSelect,
}: UploadFieldSuffixProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (file) onSelect(file);
  }

  return (
    <>
      <input
        accept={accept}
        className="hidden"
        onChange={handleChange}
        ref={inputRef}
        type="file"
      />
      <button
        aria-label={label}
        className="flex w-12 shrink-0 items-center justify-center border-l border-border text-[#2F4B4F]/65 transition hover:bg-white hover:text-primary"
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <Upload className="size-4" />
      </button>
    </>
  );
}

export { UploadFieldSuffix };
