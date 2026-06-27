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
import { getBusinessSlug } from "@piya/shared";
import {
  ConnectDomainSheet,
  ConnectEmailSheet,
} from "@/pages/profile/components";
import type { SetupDraft } from "@/pages/auth/utils/account-setup-types";

type IntegrationTab =
  | "domain"
  | "message-channel"
  | "availability"
  | "delivery";

type IntegrationConnection = {
  action?: "domain" | "email" | "whatsapp";
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
        action: "domain",
        name: "Connect domain",
        subtitle:
          "Set up a Piya sub-domain or custom domain for customers to visit your portal.",
      },
    ],
  },
  "message-channel": {
    title: "Message channel",
    connections: [
      {
        action: "email",
        name: "Connect email",
        subtitle:
          "Choose the address customers see and where their replies are sent.",
      },
      {
        name: "Connect SMS",
        subtitle: "Deliver short updates and reminders by text message.",
      },
      {
        action: "whatsapp",
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

type IntegrationStepProps = {
  draft: SetupDraft;
  setDraft: React.Dispatch<React.SetStateAction<SetupDraft>>;
};

function IntegrationStep({ draft, setDraft }: IntegrationStepProps) {
  const [activeTab, setActiveTab] = useState<IntegrationTab>("domain");
  const [isDomainSheetOpen, setIsDomainSheetOpen] = useState(false);
  const [isEmailSheetOpen, setIsEmailSheetOpen] = useState(false);
  const activeIntegration = integrationsByTab[activeTab];
  const suggestedSlug =
    draft.integration.slug || getBusinessSlug(draft.businessProfile.name);
  const suggestedFromEmailLocalPart =
    draft.integration.email.fromEmailLocalPart || suggestedSlug;
  const suggestedReplyToEmail =
    draft.integration.email.replyToEmail || draft.businessProfile.email || "";

  function connectDomain(slug: string) {
    setDraft((current) => ({
      ...current,
      integration: {
        ...current.integration,
        domainConnected: true,
        email: {
          ...current.integration.email,
          fromEmailLocalPart: slug,
        },
        slug,
      },
    }));
  }

  function connectEmail(input: {
    fromEmailLocalPart: string;
    replyToEmail: string;
  }) {
    setDraft((current) => ({
      ...current,
      integration: {
        ...current.integration,
        domainConnected: true,
        email: input,
        emailConnected: true,
        slug: input.fromEmailLocalPart,
      },
    }));
  }

  return (
    <>
      <div className="max-w-[820px] space-y-4">
        <SegmentedTabs
          items={integrationTabs}
          onValueChange={setActiveTab}
          value={activeTab}
        />

        <SettingsCard title={activeIntegration.title}>
          <div className="grid gap-3">
            {activeIntegration.connections.map((connection) => {
              const connected =
                connection.action === "domain"
                  ? draft.integration.domainConnected
                  : connection.action === "email"
                    ? draft.integration.emailConnected
                    : connection.connected;

              return (
                <ConnectionCard
                  connection={{ ...connection, connected }}
                  key={connection.name}
                  onClick={
                    connection.action === "domain"
                      ? () => setIsDomainSheetOpen(true)
                      : connection.action === "email"
                        ? () => setIsEmailSheetOpen(true)
                        : undefined
                  }
                />
              );
            })}
          </div>
        </SettingsCard>
      </div>

      <ConnectDomainSheet
        initialSlug={suggestedSlug}
        onClose={() => setIsDomainSheetOpen(false)}
        onConnect={connectDomain}
        open={isDomainSheetOpen}
      />
      <ConnectEmailSheet
        initialFromEmailLocalPart={suggestedFromEmailLocalPart}
        initialReplyToEmail={suggestedReplyToEmail}
        onClose={() => setIsEmailSheetOpen(false)}
        onConnect={connectEmail}
        open={isEmailSheetOpen}
      />
    </>
  );
}

function ConnectionCard({
  connection,
  onClick,
}: {
  connection: IntegrationConnection;
  onClick?: () => void;
}) {
  return (
    <button
      className="flex w-full items-center gap-3 rounded-md border border-border bg-fill px-4 py-4 text-left transition hover:border-primary/30 hover:bg-secondary/25"
      onClick={onClick}
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
      {onClick ? (
        <ChevronRight className="size-5 shrink-0 text-[#2F4B4F]/45" />
      ) : null}
    </button>
  );
}

export { IntegrationStep };
