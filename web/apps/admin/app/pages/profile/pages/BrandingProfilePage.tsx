import { Button } from "@yinapp/ui";
import { profileMenuItems } from "../profileSections";
import { FieldGrid, ProfileField } from "../components/ProfileFields";
import { ProfileSectionShell } from "../components/ProfileSectionShell";
import { SettingsCard } from "../components/SettingsCard";

const section = profileMenuItems.find((item) => item.value === "branding")!;

const colors = [
  { label: "Primary color", value: "#2F4B4F" },
  { label: "Secondary color", value: "#F4C95D" },
  { label: "Accent color", value: "#F6F8F7" },
];

export function BrandingProfilePage() {
  return (
    <ProfileSectionShell
      actions={<Button size="sm">Save changes</Button>}
      description={section.description}
      icon={section.icon}
      title={section.label}
    >
      <SettingsCard title="Brand assets">
        <FieldGrid>
          <ProfileField label="Logo URL" value="/assets/logo.png" />
          <ProfileField label="Favicon URL" value="/favicon.ico" />
          <ProfileField label="Cover image URL" value="/assets/cover.png" />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Social links">
        <FieldGrid>
          <ProfileField label="Instagram" value="@yinapp" />
          <ProfileField label="X / Twitter" value="@yinapp" />
          <ProfileField label="Facebook" value="https://facebook.com/yinapp" />
          <ProfileField
            label="LinkedIn"
            value="https://linkedin.com/company/yinapp"
          />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Brand colors">
        <div className="grid gap-3 sm:grid-cols-3">
          {colors.map((color) => (
            <label className="grid gap-2" key={color.label}>
              <span className="text-footnote font-semibold text-[#2F4B4F]">
                {color.label}
              </span>
              <span className="flex h-12 items-center gap-3 rounded-sm border border-border bg-fill px-3">
                <span
                  className="size-6 rounded-full border border-border"
                  style={{ backgroundColor: color.value }}
                />
                <input
                  className="min-w-0 flex-1 bg-transparent text-callout text-[#2F4B4F] outline-none"
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
