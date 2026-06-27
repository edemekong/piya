import type * as React from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  Globe2,
  MessageCircle,
  Truck,
} from "lucide-react";
import { SegmentedTabs, SettingsCard } from "@piya/ui";
import { useState } from "react";

type IntegrationTab =
  | "domain"
  | "message-channel"
  | "availability"
  | "delivery";

type IntegrationConnection = {
  connected?: boolean;
  name: string;
  subtitle: string;
};

const integrationTabs = [
  {
    icon: <Globe2 className="size-4" />,
    label: "Domain",
    value: "domain",
  },
  {
    icon: <MessageCircle className="size-4" />,
    label: "Message",
    value: "message-channel",
  },
  {
    icon: <CalendarDays className="size-4" />,
    label: "Availability",
    value: "availability",
  },
  {
    icon: <Truck className="size-4" />,
    label: "Delivery",
    value: "delivery",
  },
] satisfies {
  icon: React.ReactNode;
  label: string;
  value: IntegrationTab;
}[];

const integrationsByTab: Record<
  IntegrationTab,
  { title: string; connections: IntegrationConnection[] }
> = {
  domain: {
    title: "Domain",
    connections: [
      {
        connected: true,
        name: "Connect your domain",
        subtitle:
          "Let customers visit your business at your own website address instead of a Piya link.",
      },
    ],
  },
  "message-channel": {
    title: "Message channel",
    connections: [
      {
        connected: true,
        name: "Connect email",
        subtitle:
          "Send customer emails from your business address for orders, replies, and updates.",
      },
      {
        name: "Connect SMS",
        subtitle: "Deliver short updates and reminders by text message.",
      },
      {
        name: "Connect WhatsApp",
        subtitle: "Reach clients through WhatsApp conversations and alerts.",
      },
    ],
  },
  availability: {
    title: "Availability",
    connections: [
      {
        name: "Connect calendar",
        subtitle: "Sync events and consultations with your external calendar.",
      },
      {
        connected: true,
        name: "Set up available hours",
        subtitle: "Choose the days and times clients can book with you.",
      },
    ],
  },
  delivery: {
    title: "Delivery integration",
    connections: [
      {
        name: "Set delivery prices",
        subtitle:
          "Configure price per kilometer for each available delivery vehicle.",
      },
    ],
  },
};

function IntegrationStep() {
  const [activeTab, setActiveTab] = useState<IntegrationTab>("domain");
  const activeIntegration = integrationsByTab[activeTab];

  return (
    <div className="max-w-[820px] space-y-4">
      <SegmentedTabs
        items={integrationTabs}
        onValueChange={setActiveTab}
        value={activeTab}
      />

      <SettingsCard title={activeIntegration.title}>
        <div className="grid gap-3">
          {activeIntegration.connections.map((connection) => (
            <ConnectionCard connection={connection} key={connection.name} />
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}

function ConnectionCard({
  connection,
}: {
  connection: IntegrationConnection;
}) {
  return (
    <button
      className="flex w-full items-center gap-3 rounded-md border border-border bg-fill px-4 py-4 text-left transition hover:border-primary/30 hover:bg-secondary/25"
      type="button"
    >
      {connection.connected ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
          <Check className="size-5 stroke-[3]" />
        </span>
      ) : (
        <Circle className="size-8 shrink-0 text-[#2F4B4F]/35" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-[#2F4B4F]">
          {connection.name}
        </span>
        <span className="mt-1 block text-callout text-[#2F4B4F]/65">
          {connection.subtitle}
        </span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-[#2F4B4F]/45" />
    </button>
  );
}

export { IntegrationStep };
