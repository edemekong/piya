import {
  Globe,
  LayoutDashboard,
  Megaphone,
  Package,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "@remix-run/react";
import { AppAvatar, cn } from "@piya/ui";
import { useGetAccountSetupQuery } from "@piya/shared";
import { getOfferingDisplayConfig } from "@/utils/offering-display";

type SidebarItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

const sidebarItems: SidebarItem[] = [
  { label: "Overview", to: "/overview", icon: LayoutDashboard },
  { label: "Contacts", to: "/contacts", icon: Users },
  { label: "Orders", to: "/orders", icon: ShoppingCart },
  { label: "Offerings", to: "/offerings", icon: Package },
  { label: "Site", to: "/site", icon: Globe },
  { label: "Communications", to: "/communications", icon: Megaphone },
];

export function Sidebar() {
  const { data: accountSetup } = useGetAccountSetupQuery();
  const offeringDisplay = getOfferingDisplayConfig(
    accountSetup?.business?.category ?? null,
  );
  const userName = accountSetup?.user.name || "User";
  const items = sidebarItems.map((item) =>
    item.to === "/offerings"
      ? { ...item, label: offeringDisplay.plural }
      : item,
  );

  return (
    <aside className="sticky top-0 flex h-screen w-24 shrink-0 flex-col items-center border-r border-primary/20 bg-secondary py-6">
      <img
        alt="Piya"
        className="size-12 rounded-md object-contain"
        src="/assets/logo.png"
      />

      <nav aria-label="Admin" className="mt-10 flex flex-1 flex-col gap-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              aria-label={item.label}
              className={({ isActive }) =>
                cn(
                  "group relative flex size-14 items-center justify-center rounded-md border transition-colors",
                  isActive
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-transparent text-[#2F4B4F] hover:border-primary/20 hover:bg-white/40",
                )
              }
              key={item.to}
              to={item.to}
            >
              <Icon className="size-7" />
              <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-20 -translate-y-1/2 whitespace-nowrap rounded-md bg-primary px-3 py-2 text-footnote font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <NavLink
        aria-label="User profile"
        className={({ isActive }) =>
          cn(
            "group relative mt-6 flex size-14 items-center justify-center rounded-md border transition-colors",
            isActive
              ? "border-primary bg-primary shadow-sm"
              : "border-transparent hover:border-primary/20 hover:bg-white/40",
          )
        }
        to="/profile"
      >
        <AppAvatar
          className="size-12 text-headline"
          imageUrl={accountSetup?.user.profileImageUrl}
          name={userName}
        />
        <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-20 -translate-y-1/2 whitespace-nowrap rounded-md bg-primary px-3 py-2 text-footnote font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100">
          Profile
        </span>
      </NavLink>
    </aside>
  );
}
