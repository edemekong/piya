import { MoreVertical, Send } from "lucide-react";
import { AppAvatar, Badge, Button, SettingsCard } from "@piya/ui";
import {
  FieldGrid,
  ProfileField,
  ProfileSelect,
} from "@/pages/profile/components/ProfileFields";

const members = [
  { email: "amara@example.com", name: "Amara Okafor", role: "Admin" },
  { email: "tunde@example.com", name: "Tunde Balogun", role: "Support" },
  { email: "maya@example.com", name: "Maya Chen", role: "Marketing" },
];

function TeamStep() {
  return (
    <div className="max-w-[820px] space-y-4">
      <SettingsCard
        actions={
          <Button icon={<Send />} size="sm" type="button">
            Send invite
          </Button>
        }
        title="Invite teammate"
      >
        <FieldGrid className="md:grid-cols-[minmax(0,1fr)_220px]">
          <ProfileField
            label="Email address"
            placeholder="Enter teammate email"
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
    </div>
  );
}

export { TeamStep };
