import { Upload, UserRound } from "lucide-react";
import { Button } from "@yinapp/ui";
import { profileMenuItems } from "../profileSections";
import { FieldGrid, ProfileField } from "../components/ProfileFields";
import { ProfileSectionShell } from "../components/ProfileSectionShell";
import { SettingsCard } from "../components/SettingsCard";

const section = profileMenuItems.find((item) => item.value === "personal")!;

export function PersonalProfilePage() {
  return (
    <ProfileSectionShell
      actions={<Button size="sm">Save changes</Button>}
      description={section.description}
      icon={section.icon}
      title={section.label}
    >
      <SettingsCard title="Profile image">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <UserRound className="size-9" />
            </span>
            <div>
              <p className="font-semibold text-[#2F4B4F]">Paul Jeremiah</p>
              <p className="mt-1 text-callout text-[#2F4B4F]/65">
                JPG, PNG, or WebP. Recommended size 400x400.
              </p>
            </div>
          </div>
          <Button icon={<Upload />} size="sm" variant="secondary">
            Upload image
          </Button>
        </div>
      </SettingsCard>

      <SettingsCard title="Personal information">
        <FieldGrid>
          <ProfileField label="First name" value="Paul" />
          <ProfileField label="Last name" value="Jeremiah" />
          <ProfileField
            label="Email address"
            type="email"
            value="paul@yinapp.com"
          />
          <ProfileField
            label="Phone number"
            type="tel"
            value="+234 801 000 0000"
          />
        </FieldGrid>
      </SettingsCard>
    </ProfileSectionShell>
  );
}
