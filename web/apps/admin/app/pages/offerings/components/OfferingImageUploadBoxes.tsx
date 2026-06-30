import * as React from "react";
import { Plus } from "lucide-react";
import { AppSheet } from "@piya/ui";

type OfferingImageUploadBoxesProps = {
  images: string[];
  label: string;
  multiple?: boolean;
  onImagesChange: (images: string[]) => void;
};

function OfferingImageUploadBoxes({
  images,
  label,
  multiple = false,
  onImagesChange,
}: OfferingImageUploadBoxesProps) {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    Promise.all(Array.from(files).map(readImageFile)).then((nextImages) => {
      const validImages = nextImages.filter(Boolean);
      if (!validImages.length) return;

      onImagesChange(multiple ? [...images, ...validImages] : [validImages[0]]);
    });
  }

  return (
    <>
      <div className="grid gap-2">
        <span className="text-footnote font-normal text-[#2F4B4F]">{label}</span>
        <div className="flex flex-wrap gap-3">
          {images.map((image, index) => (
            <button
              aria-label={`Preview ${label.toLowerCase()} ${index + 1}`}
              className="size-24 overflow-hidden rounded-md border border-border bg-fill transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              key={`${image}_${index}`}
              onClick={() => setPreviewImage(image)}
              type="button"
            >
              <img
                alt=""
                className="size-full object-cover"
                src={image}
              />
            </button>
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
              multiple={multiple}
              onChange={(event) => handleFiles(event.currentTarget.files)}
              type="file"
            />
          </label>
        </div>
      </div>
      <AppSheet
        ariaLabel="image preview"
        bodyClassName="flex items-center justify-center bg-fill p-4"
        maxWidthClassName="max-w-4xl"
        onClose={() => setPreviewImage(null)}
        open={Boolean(previewImage)}
        title="Image preview"
      >
        {previewImage ? (
          <img
            alt=""
            className="max-h-[calc(100vh-150px)] w-full rounded-md object-contain"
            src={previewImage}
          />
        ) : null}
      </AppSheet>
    </>
  );
}

function readImageFile(file: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : "");
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

export { OfferingImageUploadBoxes };
