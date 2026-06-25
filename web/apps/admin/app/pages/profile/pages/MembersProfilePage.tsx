import { MoreVertical, Send } from "lucide-react";
import { AppAvatar, Badge, Button } from "@piya/ui";
import { profileMenuItems } from "../profileSections";
import {
  FieldGrid,
  ProfileField,
  ProfileSelect,
} from "../components/ProfileFields";
import { SettingsCard, SettingsSection as ProfileSectionShell } from "@piya/ui";

const section = profileMenuItems.find((item) => item.value === "members")!;

const members = [
  { email: "amara@example.com", name: "Amara Okafor", role: "Admin" },
  { email: "tunde@example.com", name: "Tunde Balogun", role: "Support" },
  { email: "maya@example.com", name: "Maya Chen", role: "Marketing" },
];

export function MembersProfilePage() {
  return (
    <ProfileSectionShell
      description={section.description}
      icon={section.icon}
      title={section.label}
    >
      <SettingsCard
        actions={
          <Button icon={<Send />} size="sm">
            Send invite
          </Button>
        }
        title="Invite teammate"
      >
        <FieldGrid className="md:grid-cols-[minmax(0,1fr)_220px]">
          <ProfileField
            label="Email address"
            placeholder="teammate@example.com"
          />
          <ProfileSelect
            label="Role"
            options={["Admin", "Manager"]}
            value="Admin"
          />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Team members">
        <div className="grid gap-2">
          {members.map((member) => (
            <div
              className="flex items-center gap-3 rounded-md bg-fill px-3 py-3"
              key={member.email}
            >
              <AppAvatar className="size-10" name={member.name} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#2F4B4F]">{member.name}</p>
                <p className="truncate text-footnote text-[#2F4B4F]/60">
                  {member.email}
                </p>
              </div>
              <Badge>{member.role}</Badge>
              <button
                aria-label={`Open actions for ${member.name}`}
                className="flex size-8 items-center justify-center rounded-full text-[#2F4B4F]/60 hover:bg-white"
                type="button"
              >
                <MoreVertical className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </SettingsCard>
    </ProfileSectionShell>
  );
}
