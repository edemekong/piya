import * as React from "react";
import { ProfileSidebar } from "./components";
import {
  BrandingProfilePage,
  BusinessProfilePage,
  IntegrationProfilePage,
  MembersProfilePage,
  NotificationsProfilePage,
  PersonalProfilePage,
  SecurityProfilePage,
} from "./pages";
import type { ProfileSection } from "./profileSections";

export function ProfilePage() {
  const [activeSection, setActiveSection] =
    React.useState<ProfileSection>("personal");

  return (
    <div className="grid gap-6">
      <header className="rounded-md bg-white p-6 shadow-sm">
        <h1 className="text-title-1 font-semibold text-[#2F4B4F]">Profile</h1>
        <p className="mt-2 max-w-2xl text-callout text-[#2F4B4F]/75">
          Manage your account, business profile, team, and messaging setup.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
        <ProfileSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <ProfileSectionContent section={activeSection} />
      </div>
    </div>
  );
}

function ProfileSectionContent({ section }: { section: ProfileSection }) {
  switch (section) {
    case "business":
      return <BusinessProfilePage />;
    case "branding":
      return <BrandingProfilePage />;
    case "members":
      return <MembersProfilePage />;
    case "channels":
      return <IntegrationProfilePage />;
    case "security":
      return <SecurityProfilePage />;
    case "notifications":
      return <NotificationsProfilePage />;
    case "personal":
    default:
      return <PersonalProfilePage />;
  }
}
