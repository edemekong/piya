import { Button } from "@piya/ui";
import { profileMenuItems } from "../profileSections";
import { SettingsCard, SettingsSection as ProfileSectionShell } from "@piya/ui";

const section = profileMenuItems.find(
  (item) => item.value === "notifications"
)!;

const toggles = ["New orders", "Customer messages", "Low stock alerts"];

export function NotificationsProfilePage() {
  return (
    <ProfileSectionShell
      actions={<Button size="sm">Save preferences</Button>}
      description={section.description}
      icon={section.icon}
      title={section.label}
    >
      <SettingsCard title="Notification delivery">
        <div className="grid gap-3">
          {toggles.map((toggle) => (
            <label
              className="flex items-center justify-between gap-4 rounded-md bg-fill px-3 py-3"
              key={toggle}
            >
              <span className="font-semibold text-[#2F4B4F]">{toggle}</span>
              <input
                className="size-5 accent-primary"
                defaultChecked
                type="checkbox"
              />
            </label>
          ))}
        </div>
      </SettingsCard>
    </ProfileSectionShell>
  );
}
