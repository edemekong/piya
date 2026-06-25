import { cn } from "@yinapp/ui";
import type { ProfileSection } from "../profileSections";
import { profileMenuItems } from "../profileSections";

type ProfileSidebarProps = {
  activeSection: ProfileSection;
  onSectionChange: (section: ProfileSection) => void;
};

export function ProfileSidebar({
  activeSection,
  onSectionChange,
}: ProfileSidebarProps) {
  return (
    <aside className="h-fit rounded-md bg-white p-3 shadow-sm">
      <nav aria-label="Profile settings" className="grid gap-1">
        {profileMenuItems.map((item) => {
          const Icon = item.icon;
          const active = item.value === activeSection;

          return (
            <button
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-3 text-left transition",
                active
                  ? "bg-primary text-white"
                  : "text-[#2F4B4F] hover:bg-fill"
              )}
              key={item.value}
              onClick={() => onSectionChange(item.value)}
              type="button"
            >
              <Icon className="size-5 shrink-0" />
              <span className="text-callout font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
