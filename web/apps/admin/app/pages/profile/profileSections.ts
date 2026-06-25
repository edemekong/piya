import {
  Bell,
  Building2,
  KeyRound,
  Palette,
  Plug,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ProfileSection =
  | "personal"
  | "business"
  | "branding"
  | "members"
  | "channels"
  | "security"
  | "notifications";

export type ProfileMenuItem = {
  description: string;
  icon: LucideIcon;
  label: string;
  value: ProfileSection;
};

export const profileMenuItems: ProfileMenuItem[] = [
  {
    description: "Profile photo, name, email, and phone.",
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
    description: "Domain, message channels, calendar, and available hours.",
    icon: Plug,
    label: "Integrations",
    value: "channels",
  },
  {
    description: "Offerings, communications, and chat alerts.",
    icon: Bell,
    label: "Notifications",
    value: "notifications",
  },
  {
    description: "Invite teammates and manage roles.",
    icon: Users,
    label: "Invite members",
    value: "members",
  },
  {
    description: "Password, sessions, and account access.",
    icon: KeyRound,
    label: "Security",
    value: "security",
  },
];
