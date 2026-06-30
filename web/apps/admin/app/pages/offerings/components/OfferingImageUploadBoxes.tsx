import * as React from "react";
import { Plus } from "lucide-react";

function OfferingImageUploadBoxes({ label }: { label: string }) {
  const [images, setImages] = React.useState<string[]>([]);

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    setImages((current) => [
      ...current,
      ...Array.from(files).map((file) => file.name),
    ]);
  }

  return (
    <div className="grid gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">{label}</span>
      <div className="flex flex-wrap gap-3">
        {images.map((imageName, index) => (
          <div
            className="flex size-24 items-center justify-center rounded-md border border-border bg-fill px-2 text-center text-caption-1 font-semibold text-[#2F4B4F]/70"
            key={`${imageName}_${index}`}
            title={imageName}
          >
            <span className="line-clamp-2 break-all">{imageName}</span>
          </div>
        ))}
        <label className="flex size-24 cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-fill text-[#2F4B4F]/65 transition hover:border-primary hover:bg-secondary/30">
          <span className="flex flex-col items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm">
              <Plus className="size-4" />
            </span>
            <span className="text-caption-1 font-semibold">Add image</span>
          </span>
          <input
            accept="image/*"
            className="sr-only"
            multiple
            onChange={(event) => handleFiles(event.currentTarget.files)}
            type="file"
          />
        </label>
      </div>
    </div>
  );
}

export { OfferingImageUploadBoxes };
