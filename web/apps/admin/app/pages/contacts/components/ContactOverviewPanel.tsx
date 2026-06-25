import * as React from "react";
import {
  ContactRound,
  Mail,
  NotebookPen,
  Phone,
  MousePointerClick,
  ShoppingBag,
  Tag,
  Trash2,
} from "lucide-react";
import {
  AppAvatar,
  Badge,
  Button,
  EmptyState,
  InfoCard,
  StatCard,
  cn,
} from "@piya/ui";
import type { ContactData } from "@piya/shared/models";
import { formatMoney } from "@piya/shared/utils";

export type ContactOverviewTab =
  | "events"
  | "orders"
  | "contact-info"
  | "notes";

const overviewTabs: {
  icon: React.ReactNode;
  label: string;
  value: ContactOverviewTab;
}[] = [
  {
    icon: <MousePointerClick className="size-4" />,
    label: "Events",
    value: "events",
  },
  { icon: <ShoppingBag className="size-4" />, label: "Orders", value: "orders" },
  {
    icon: <ContactRound className="size-4" />,
    label: "Contact info",
    value: "contact-info",
  },
  {
    icon: <NotebookPen className="size-4" />,
    label: "Notes",
    value: "notes",
  },
];

type ContactOverviewPanelProps = {
  activeTab: ContactOverviewTab;
  contact: ContactData;
  onTabChange: (tab: ContactOverviewTab) => void;
};

export function ContactOverviewPanel({
  activeTab,
  contact,
  onTabChange,
}: ContactOverviewPanelProps) {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 rounded-md bg-fill p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <AppAvatar
            className="size-16 text-[22px] leading-[1.27]"
            imageUrl={contact.profileImageUrl}
            name={contact.name}
          />
          <div>
            <h3 className="text-title-3 font-semibold text-[#2F4B4F]">
              {contact.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-callout font-semibold capitalize text-primary">
                {contact.badge.type}
              </span>
              <span className="text-footnote text-[#2F4B4F]/60">
                {contact.badge.points.toLocaleString()} points
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Button className="flex-1 sm:flex-none" icon={<NotebookPen />} size="sm">
            Add note
          </Button>
          <Button
            aria-label="Delete contact"
            className="bg-fill text-error hover:bg-error/10"
            size="icon"
            variant="secondary"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Lifetime value"
          value={formatMoney(contact.counts.lifetimeValue)}
        />
        <StatCard label="Orders" value={contact.counts.totalOrders.toString()} />
        <StatCard
          label="Last interaction"
          value={formatDate(contact.lastInteractionAt)}
        />
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2">
          {overviewTabs.map((tab) => (
            <button
              className={cn(
                "inline-flex items-center gap-2 border-b-2 px-3 py-3 text-callout font-semibold transition",
                activeTab === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-[#2F4B4F]/60 hover:text-[#2F4B4F]",
              )}
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              type="button"
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "events" ? <AuditLogPanel /> : null}
      {activeTab === "orders" ? <OrdersPanel /> : null}
      {activeTab === "contact-info" ? <ContactInfoPanel contact={contact} /> : null}
      {activeTab === "notes" ? <NotesPanel /> : null}
    </div>
  );
}

function AuditLogPanel() {
  return <EmptyState>No audit log entries yet.</EmptyState>;
}

function OrdersPanel() {
  return <EmptyState>No orders yet.</EmptyState>;
}

function ContactInfoPanel({ contact }: { contact: ContactData }) {
  const address = contact.address
    ? [
        contact.address.address,
        contact.address.city,
        contact.address.state,
        contact.address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "No address added";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <InfoCard icon={<Mail className="size-4" />} label="Email" value={contact.email} />
      <InfoCard
        icon={<Phone className="size-4" />}
        label="Phone"
        value={contact.phoneNumber}
      />
      <InfoCard label="Country code" value={contact.countryCode} />
      <InfoCard label="Date of birth" value={contact.dob ?? "Not provided"} />
      <InfoCard label="Anniversary" value={contact.anniversary ?? "Not provided"} />
      <InfoCard className="sm:col-span-2" label="Address" value={address} />
      <div className="rounded-md border border-border bg-fill/40 p-4 sm:col-span-2">
        <div className="flex items-center gap-2 text-footnote font-semibold text-[#2F4B4F]/65">
          <Tag className="size-4" />
          Tags
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {contact.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotesPanel() {
  return <EmptyState>No notes yet.</EmptyState>;
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(timestamp);
}
