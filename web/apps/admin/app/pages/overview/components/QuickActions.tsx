import { Link } from "@remix-run/react";
import { Megaphone, PackagePlus, ShoppingCart, UserPlus } from "lucide-react";

const actions = [
  {
    description: "Capture a new customer order.",
    href: "/orders",
    icon: <ShoppingCart />,
    label: "New order",
  },
  {
    description: "Add a product, service, booking, or delivery option.",
    href: "/offerings",
    icon: <PackagePlus />,
    label: "Add catalog item",
  },
  {
    description: "Send a campaign or customer update.",
    href: "/communications",
    icon: <Megaphone />,
    label: "Create campaign",
  },
  {
    description: "Create or review customer profiles.",
    href: "/contacts",
    icon: <UserPlus />,
    label: "Add contact",
  },
];

export function QuickActions() {
  return (
    <section className="flex h-full min-h-[360px] flex-col rounded-md bg-white p-6 shadow-sm">
      <h2 className="text-title-3 font-semibold text-[#2F4B4F]">
        Quick actions
      </h2>

      <div className="mt-5 grid gap-3">
        {actions.map((action) => (
          <Link
            className="flex min-h-[64px] w-full items-center gap-3 rounded-md bg-fill px-4 py-3 text-left text-[#2F4B4F] transition hover:bg-secondary/40"
            to={action.href}
            key={action.label}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm [&_svg]:size-[18px]">
              {action.icon}
            </span>
            <span className="grid min-w-0 gap-1">
              <span className="font-semibold">{action.label}</span>
              <span className="text-footnote font-normal text-[#2F4B4F]/60">
                {action.description}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
