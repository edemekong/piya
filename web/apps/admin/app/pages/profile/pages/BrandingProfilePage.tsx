import * as React from "react";
import {
  showToast,
  type AccountSetupBrandDetailsInput,
  type AccountSetupPayload,
  type AppDispatch,
  useUpdateAccountSetupMutation,
} from "@piya/shared";
import {
  Button,
  SettingsCard,
  SettingsSection as ProfileSectionShell,
} from "@piya/ui";
import { useDispatch } from "react-redux";
import { UploadFieldSuffix } from "@/components/inputs";
import { profileMenuItems } from "../profileSections";
import { FieldGrid, ProfileField } from "../components/ProfileFields";
import { getProfileErrorMessage } from "../profileErrorMessage";

const section = profileMenuItems.find((item) => item.value === "branding")!;

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

type BrandingProfilePageProps = {
  accountSetup: AccountSetupPayload;
};

export function BrandingProfilePage({
  accountSetup,
}: BrandingProfilePageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const branding = accountSetup.business?.branding;
  const [brandDetails, setBrandDetails] =
    React.useState<AccountSetupBrandDetailsInput>(() => ({
      logo: branding?.logo ?? "",
      favicon: branding?.favicon ?? "",
      coverImage: branding?.coverImage ?? "",
      primaryColor: branding?.primaryColor ?? "#2F4B4F",
      secondaryColor: branding?.secondaryColor ?? "#F4C95D",
      accentColor: branding?.accentColor ?? "#F6F8F7",
      socialLinks: {
        instagram: branding?.socialLinks?.instagram ?? "",
        x: branding?.socialLinks?.x ?? "",
        facebook: branding?.socialLinks?.facebook ?? "",
        linkedin: branding?.socialLinks?.linkedin ?? "",
      },
    }));
  const [assetErrors, setAssetErrors] = React.useState<
    Partial<Record<BrandAssetField, string>>
  >({});
  const [updateAccountSetup, updateState] = useUpdateAccountSetupMutation();
  const socialLinks = brandDetails.socialLinks ?? {};

  function updateBrandDetails<
    TField extends keyof AccountSetupBrandDetailsInput,
  >(field: TField, value: AccountSetupBrandDetailsInput[TField]) {
    setBrandDetails((current) => ({ ...current, [field]: value }));
  }

  function updateSocialLink(field: string, value: string) {
    setBrandDetails((current) => ({
      ...current,
      socialLinks: {
        ...current.socialLinks,
        [field]: value,
      },
    }));
  }

  function updateBrandAssetUrl(field: BrandAssetField, value: string) {
    setAssetErrors((current) => ({ ...current, [field]: undefined }));
    setBrandDetails((current) => ({
      ...current,
      [field]: value,
      [brandAssetBase64Fields[field]]: undefined,
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
      setBrandDetails((current) => ({
        ...current,
        [field]: getBrandAssetFileName(field, file.type),
        [brandAssetBase64Fields[field]]: base64,
      }));
    } catch {
      setAssetErrors((current) => ({
        ...current,
        [field]: "Unable to read this image. Please try another file.",
      }));
    }
  }

  async function saveBrandDetails() {
    if (!brandDetails.primaryColor.trim()) {
      showToast(dispatch, {
        message: "Enter a primary brand color.",
        variant: "error",
      });
      return;
    }

    try {
      const result = await updateAccountSetup({
        step: "brand-details",
        input: {
          ...brandDetails,
          socialLinks: getNonEmptySocialLinks(socialLinks),
        },
      }).unwrap();
      const savedBranding = result.business?.branding;

      if (savedBranding) {
        setBrandDetails({
          logo: savedBranding.logo ?? "",
          favicon: savedBranding.favicon ?? "",
          coverImage: savedBranding.coverImage ?? "",
          primaryColor: savedBranding.primaryColor,
          secondaryColor: savedBranding.secondaryColor ?? "",
          accentColor: savedBranding.accentColor ?? "",
          socialLinks: {
            instagram: savedBranding.socialLinks?.instagram ?? "",
            x: savedBranding.socialLinks?.x ?? "",
            facebook: savedBranding.socialLinks?.facebook ?? "",
            linkedin: savedBranding.socialLinks?.linkedin ?? "",
          },
        });
      }

      showToast(dispatch, {
        message: "Branding saved.",
        variant: "success",
      });
    } catch (error) {
      showToast(dispatch, {
        message: getProfileErrorMessage(
          error,
          "Unable to save your branding.",
        ),
        variant: "error",
      });
    }
  }

  return (
    <ProfileSectionShell
      actions={
        <Button
          buttonState={updateState.isLoading ? "loading" : "enabled"}
          loadingLabel="Saving branding"
          onClick={() => void saveBrandDetails()}
          size="sm"
        >
          Save changes
        </Button>
      }
      description={section.description}
      icon={section.icon}
      title={section.label}
    >
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
            value={socialLinks.instagram ?? ""}
          />
          <ProfileField
            label="X / Twitter"
            onChange={(event) => updateSocialLink("x", event.target.value)}
            value={socialLinks.x ?? ""}
          />
          <ProfileField
            label="Facebook"
            onChange={(event) =>
              updateSocialLink("facebook", event.target.value)
            }
            value={socialLinks.facebook ?? ""}
          />
          <ProfileField
            label="LinkedIn"
            onChange={(event) =>
              updateSocialLink("linkedin", event.target.value)
            }
            value={socialLinks.linkedin ?? ""}
          />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Brand colors">
        <div className="grid gap-4 sm:grid-cols-3">
          <BrandColorField
            label="Primary color"
            onChange={(value) => updateBrandDetails("primaryColor", value)}
            required
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
    </ProfileSectionShell>
  );
}

function BrandColorField({
  label,
  onChange,
  required,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">{label}</span>
      <span className="flex h-12 min-w-0 items-center gap-3 rounded-sm border border-border bg-fill px-3">
        <input
          aria-label={`${label} picker`}
          className="size-6 shrink-0 cursor-pointer rounded-full border-0 bg-transparent p-0"
          onChange={(event) => onChange(event.target.value)}
          type="color"
          value={isHexColor(value) ? value : "#000000"}
        />
        <input
          className="my-2 min-w-0 flex-1 bg-transparent text-callout text-[#2F4B4F] outline-none"
          onChange={(event) => onChange(event.target.value)}
          required={required}
          value={value}
        />
      </span>
    </label>
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
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read image."));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function getNonEmptySocialLinks(socialLinks: Record<string, string>) {
  const entries = Object.entries(socialLinks).filter(
    ([, value]) => value.trim().length > 0,
  );

  return entries.length > 0 ? Object.fromEntries(entries) : null;
}

function isHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}
