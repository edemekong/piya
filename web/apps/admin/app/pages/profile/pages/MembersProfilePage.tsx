import { TeamMembersSettings } from "@/components/TeamMembersSettings";
import { profileMenuItems } from "../profileSections";
import { SettingsSection as ProfileSectionShell } from "@piya/ui";

const section = profileMenuItems.find((item) => item.value === "members")!;

export function MembersProfilePage() {
  return (
    <ProfileSectionShell
      description={section.description}
      icon={section.icon}
      title={section.label}
    >
      <TeamMembersSettings />
    </ProfileSectionShell>
  );
}
