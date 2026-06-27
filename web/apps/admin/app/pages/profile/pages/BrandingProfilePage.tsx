import * as React from "react";
import { Button } from "@piya/ui";
import { UploadFieldSuffix } from "@/components/inputs";
import { profileMenuItems } from "../profileSections";
import { FieldGrid, ProfileField } from "../components/ProfileFields";
import { SettingsCard, SettingsSection as ProfileSectionShell } from "@piya/ui";

const section = profileMenuItems.find((item) => item.value === "branding")!;

const colors = [
  { label: "Primary color", value: "#2F4B4F" },
  { label: "Secondary color", value: "#F4C95D" },
  { label: "Accent color", value: "#F6F8F7" },
];

export function BrandingProfilePage() {
  const [brandAssets, setBrandAssets] = React.useState({
    coverImage: "/assets/cover.png",
    favicon: "/favicon.ico",
    logo: "/assets/logo.png",
  });

  function updateBrandAsset(asset: keyof typeof brandAssets, value: string) {
    setBrandAssets((current) => ({ ...current, [asset]: value }));
  }

  return (
    <ProfileSectionShell
      actions={<Button size="sm">Save changes</Button>}
      description={section.description}
      icon={section.icon}
      title={section.label}
    >
      <SettingsCard title="Brand assets">
        <FieldGrid>
          <ProfileField
            label="Logo"
            onChange={(event) => updateBrandAsset("logo", event.target.value)}
            suffix={
              <UploadFieldSuffix
                accept="image/*"
                label="Upload logo"
                onSelect={(file) =>
                  updateBrandAsset("logo", URL.createObjectURL(file))
                }
              />
            }
            value={brandAssets.logo}
          />
          <ProfileField
            label="Favicon"
            onChange={(event) =>
              updateBrandAsset("favicon", event.target.value)
            }
            suffix={
              <UploadFieldSuffix
                accept="image/png,image/svg+xml,image/x-icon,image/vnd.microsoft.icon"
                label="Upload favicon"
                onSelect={(file) =>
                  updateBrandAsset("favicon", URL.createObjectURL(file))
                }
              />
            }
            value={brandAssets.favicon}
          />
          <ProfileField
            label="Cover image"
            onChange={(event) =>
              updateBrandAsset("coverImage", event.target.value)
            }
            suffix={
              <UploadFieldSuffix
                accept="image/*"
                label="Upload cover image"
                onSelect={(file) =>
                  updateBrandAsset("coverImage", URL.createObjectURL(file))
                }
              />
            }
            value={brandAssets.coverImage}
          />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Social links">
        <FieldGrid>
          <ProfileField label="Instagram" value="@piya" />
          <ProfileField label="X / Twitter" value="@piya" />
          <ProfileField label="Facebook" value="https://facebook.com/piya" />
          <ProfileField
            label="LinkedIn"
            value="https://linkedin.com/company/piya"
          />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Brand colors">
        <div className="grid gap-4 sm:grid-cols-3">
          {colors.map((color) => (
            <label className="grid min-w-0 gap-2" key={color.label}>
              <span className="text-footnote font-normal text-[#2F4B4F]">
                {color.label}
              </span>
              <span className="flex h-12 min-w-0 items-center gap-3 rounded-sm border border-border bg-fill px-3">
                <span
                  className="size-6 rounded-full border border-border"
                  style={{ backgroundColor: color.value }}
                />
                <input
                  className="my-2 min-w-0 flex-1 bg-transparent text-callout text-[#2F4B4F] outline-none"
                  defaultValue={color.value}
                />
              </span>
            </label>
          ))}
        </div>
      </SettingsCard>
    </ProfileSectionShell>
  );
}
