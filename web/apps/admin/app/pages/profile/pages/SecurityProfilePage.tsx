import { Button } from "@piya/ui";
import { profileMenuItems } from "../profileSections";
import { FieldGrid, ProfileField } from "../components/ProfileFields";
import { ProfileSectionShell } from "../components/ProfileSectionShell";
import { SettingsCard } from "../components/SettingsCard";

const section = profileMenuItems.find((item) => item.value === "security")!;

export function SecurityProfilePage() {
  return (
    <ProfileSectionShell
      actions={<Button size="sm">Update password</Button>}
      description={section.description}
      icon={section.icon}
      title={section.label}
    >
      <SettingsCard title="Password">
        <FieldGrid>
          <ProfileField label="Current password" type="password" />
          <ProfileField label="New password" type="password" />
        </FieldGrid>
      </SettingsCard>
    </ProfileSectionShell>
  );
}
