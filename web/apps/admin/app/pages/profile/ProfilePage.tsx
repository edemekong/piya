import * as React from "react";
import {
  Bell,
  Building2,
  KeyRound,
  Mail,
  MapPin,
  Palette,
  ShieldCheck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader, cn } from "@yinapp/ui";

type ProfileSection =
  | "personal"
  | "business"
  | "branding"
  | "members"
  | "locations"
  | "channels"
  | "security"
  | "notifications";

type ProfileMenuItem = {
  description: string;
  icon: LucideIcon;
  label: string;
  value: ProfileSection;
};

const profileMenuItems: ProfileMenuItem[] = [
  {
    description: "Name, email, phone, and personal preferences.",
    icon: UserRound,
    label: "Personal",
    value: "personal",
  },
  {
    description: "Business name, category, contact details, and domain.",
    icon: Building2,
    label: "Business details",
    value: "business",
  },
  {
    description: "Logo, cover image, colors, and social links.",
    icon: Palette,
    label: "Branding",
    value: "branding",
  },
  {
    description: "Invite teammates and manage roles.",
    icon: Users,
    label: "Invite members",
    value: "members",
  },
  {
    description: "Stores, offices, and service areas.",
    icon: MapPin,
    label: "Locations",
    value: "locations",
  },
  {
    description: "WhatsApp, SMS, and email sender setup.",
    icon: Mail,
    label: "Messaging channels",
    value: "channels",
  },
  {
    description: "Password, sessions, and account access.",
    icon: KeyRound,
    label: "Security",
    value: "security",
  },
  {
    description: "Product, campaign, and chat alerts.",
    icon: Bell,
    label: "Notifications",
    value: "notifications",
  },
];

export function ProfilePage() {
  const [activeSection, setActiveSection] =
    React.useState<ProfileSection>("personal");
  const currentSection =
    profileMenuItems.find((item) => item.value === activeSection) ??
    profileMenuItems[0];
  const CurrentIcon = currentSection.icon;

  return (
    <div className="grid gap-6">
      <header className="rounded-md bg-white p-6 shadow-sm">
        <h1 className="text-title-1 font-semibold text-[#2F4B4F]">Profile</h1>
        <p className="mt-2 max-w-2xl text-callout text-[#2F4B4F]/75">
          Manage your account, business profile, team, and messaging setup.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-md bg-white p-3 shadow-sm">
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
                      : "text-[#2F4B4F] hover:bg-fill",
                  )}
                  key={item.value}
                  onClick={() => setActiveSection(item.value)}
                  type="button"
                >
                  <Icon className="size-5 shrink-0" />
                  <span className="text-callout font-semibold">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="rounded-md bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
              <CurrentIcon className="size-6" />
            </span>
            <SectionHeader
              description={currentSection.description}
              title={currentSection.label}
            />
          </div>

          <div className="mt-8 rounded-md border border-dashed border-border bg-fill/40 p-6">
            <div className="flex items-center gap-3 text-[#2F4B4F]">
              <ShieldCheck className="size-5 text-primary" />
              <p className="text-headline font-semibold">
                {currentSection.label} settings
              </p>
            </div>
            <p className="mt-2 text-callout text-[#2F4B4F]/70">
              This section is ready for the {currentSection.label.toLowerCase()} form.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
