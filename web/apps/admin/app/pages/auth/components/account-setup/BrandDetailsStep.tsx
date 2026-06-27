import * as React from "react";
import type { AccountSetupBrandDetailsInput } from "@piya/shared";
import { SettingsCard } from "@piya/ui";
import { UploadFieldSuffix } from "@/components/inputs";
import {
  FieldGrid,
  ProfileField,
} from "@/pages/profile/components/ProfileFields";
import type { SetupDraft } from "@/pages/auth/utils/account-setup-types";

type BrandDetailsStepProps = {
  draft: SetupDraft;
  setDraft: React.Dispatch<React.SetStateAction<SetupDraft>>;
};

type BrandAssetField = "logo" | "favicon" | "coverImage";

const brandAssetBase64Fields = {
  logo: "logoBase64",
  favicon: "faviconBase64",
  coverImage: "coverImageBase64",
} as const satisfies Record<
  BrandAssetField,
  keyof AccountSetupBrandDetailsInput
>;

const brandAssetFileNames: Record<BrandAssetField, string> = {
  logo: "logo",
  favicon: "favicon",
  coverImage: "cover-image",
};

function BrandDetailsStep({ draft, setDraft }: BrandDetailsStepProps) {
  const brandDetails = draft.brandDetails;
  const socialLinks = brandDetails.socialLinks ?? {};
  const [assetErrors, setAssetErrors] = React.useState<
    Partial<Record<BrandAssetField, string>>
  >({});

  function updateBrandDetails(
    field: keyof AccountSetupBrandDetailsInput,
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      brandDetails: {
        ...current.brandDetails,
        [field]: value,
      },
    }));
  }

  function updateSocialLink(field: string, value: string) {
    setDraft((current) => ({
      ...current,
      brandDetails: {
        ...current.brandDetails,
        socialLinks: {
          ...current.brandDetails.socialLinks,
          [field]: value,
        },
      },
    }));
  }

  function updateBrandAssetUrl(field: BrandAssetField, value: string) {
    setAssetErrors((current) => ({ ...current, [field]: undefined }));
    setDraft((current) => ({
      ...current,
      brandDetails: {
        ...current.brandDetails,
        [field]: value,
        [brandAssetBase64Fields[field]]: undefined,
      },
    }));
  }

  async function selectBrandAsset(field: BrandAssetField, file: File) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAssetErrors((current) => ({
        ...current,
        [field]: "Upload a JPG, PNG, or WebP image.",
      }));
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setAssetErrors((current) => ({
        ...current,
        [field]: "Image must not exceed 4 MB.",
      }));
      return;
    }

    try {
      const base64 = await readImageFile(file);
      setAssetErrors((current) => ({ ...current, [field]: undefined }));
      setDraft((current) => ({
        ...current,
        brandDetails: {
          ...current.brandDetails,
          [field]: getBrandAssetFileName(field, file.type),
          [brandAssetBase64Fields[field]]: base64,
        },
      }));
    } catch {
      setAssetErrors((current) => ({
        ...current,
        [field]: "Unable to read this image. Please try another file.",
      }));
    }
  }

  return (
    <div className="max-w-[820px] space-y-4">
      <SettingsCard title="Brand assets">
        <FieldGrid>
          <ProfileField
            error={assetErrors.logo}
            label="Logo"
            onChange={(event) =>
              updateBrandAssetUrl("logo", event.target.value)
            }
            placeholder="Paste image URL or upload"
            suffix={
              <UploadFieldSuffix
                accept="image/jpeg,image/png,image/webp"
                label="Upload logo"
                onSelect={(file) => void selectBrandAsset("logo", file)}
              />
            }
            value={brandDetails.logo ?? ""}
          />
          <ProfileField
            error={assetErrors.favicon}
            label="Favicon"
            onChange={(event) =>
              updateBrandAssetUrl("favicon", event.target.value)
            }
            placeholder="Paste image URL or upload"
            suffix={
              <UploadFieldSuffix
                accept="image/jpeg,image/png,image/webp"
                label="Upload favicon"
                onSelect={(file) => void selectBrandAsset("favicon", file)}
              />
            }
            value={brandDetails.favicon ?? ""}
          />
          <ProfileField
            error={assetErrors.coverImage}
            label="Cover image"
            onChange={(event) =>
              updateBrandAssetUrl("coverImage", event.target.value)
            }
            placeholder="Paste image URL or upload"
            suffix={
              <UploadFieldSuffix
                accept="image/jpeg,image/png,image/webp"
                label="Upload cover image"
                onSelect={(file) => void selectBrandAsset("coverImage", file)}
              />
            }
            value={brandDetails.coverImage ?? ""}
          />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Social links">
        <FieldGrid>
          <ProfileField
            label="Instagram"
            onChange={(event) =>
              updateSocialLink("instagram", event.target.value)
            }
            placeholder="Enter Instagram handle"
            value={socialLinks.instagram ?? ""}
          />
          <ProfileField
            label="X / Twitter"
            onChange={(event) => updateSocialLink("x", event.target.value)}
            placeholder="Enter X handle"
            value={socialLinks.x ?? ""}
          />
          <ProfileField
            label="Facebook"
            onChange={(event) =>
              updateSocialLink("facebook", event.target.value)
            }
            placeholder="Enter Facebook URL"
            value={socialLinks.facebook ?? ""}
          />
          <ProfileField
            label="LinkedIn"
            onChange={(event) =>
              updateSocialLink("linkedin", event.target.value)
            }
            placeholder="Enter LinkedIn URL"
            value={socialLinks.linkedin ?? ""}
          />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Brand colors">
        <div className="grid gap-4 sm:grid-cols-3">
          <BrandColorField
            label="Primary color"
            onChange={(value) => updateBrandDetails("primaryColor", value)}
            value={brandDetails.primaryColor}
          />
          <BrandColorField
            label="Secondary color"
            onChange={(value) => updateBrandDetails("secondaryColor", value)}
            value={brandDetails.secondaryColor ?? ""}
          />
          <BrandColorField
            label="Accent color"
            onChange={(value) => updateBrandDetails("accentColor", value)}
            value={brandDetails.accentColor ?? ""}
          />
        </div>
      </SettingsCard>
    </div>
  );
}

function getBrandAssetFileName(field: BrandAssetField, contentType: string) {
  const extension =
    contentType === "image/png"
      ? "png"
      : contentType === "image/webp"
        ? "webp"
        : "jpg";

  return `${brandAssetFileNames[field]}.${extension}`;
}

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("Invalid image data"));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function BrandColorField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">{label}</span>
      <span className="flex h-12 min-w-0 items-center gap-3 rounded-sm border border-border bg-fill px-3">
        <span
          className="size-6 rounded-full border border-border"
          style={{ backgroundColor: value || "transparent" }}
        />
        <input
          className="my-2 min-w-0 flex-1 bg-transparent text-callout text-[#2F4B4F] outline-none"
          onChange={(event) => onChange(event.target.value)}
          value={value}
        />
      </span>
    </label>
  );
}

export { BrandDetailsStep };
