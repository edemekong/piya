import * as React from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  Globe2,
  MessageCircle,
  Truck,
} from "lucide-react";
import { SegmentedTabs } from "@piya/ui";
import {
  getBusinessSlug,
  type AccountSetupEmailIntegrationInput,
} from "@piya/shared";
import { ConnectDomainSheet } from "../components/ConnectDomainSheet";
import { ConnectEmailSheet } from "../components/ConnectEmailSheet";
import { ConnectWhatsAppSheet } from "../components/ConnectWhatsAppSheet";
import { profileMenuItems } from "../profileSections";
import { SettingsCard, SettingsSection as ProfileSectionShell } from "@piya/ui";

const section = profileMenuItems.find((item) => item.value === "channels")!;

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

export function IntegrationProfilePage() {
  const [activeTab, setActiveTab] = React.useState<IntegrationTab>("domain");
  const [domainConnected, setDomainConnected] = React.useState(false);
  const [emailConnected, setEmailConnected] = React.useState(false);
  const [isDomainSheetOpen, setIsDomainSheetOpen] = React.useState(false);
  const [isEmailSheetOpen, setIsEmailSheetOpen] = React.useState(false);
  const [isWhatsAppSheetOpen, setIsWhatsAppSheetOpen] = React.useState(false);
  const [slug, setSlug] = React.useState(getBusinessSlug("Piya Store"));
  const [email, setEmail] =
    React.useState<AccountSetupEmailIntegrationInput>({
      fromEmailLocalPart: getBusinessSlug("Piya Store"),
      replyToEmail: "hello@piya.store",
    });
  const activeIntegration = integrationsByTab[activeTab];

  function connectDomain(nextSlug: string) {
    setSlug(nextSlug);
    setEmail((current) => ({
      ...current,
      fromEmailLocalPart: nextSlug,
    }));
    setDomainConnected(true);
  }

  function connectEmail(input: AccountSetupEmailIntegrationInput) {
    setEmail(input);
    setSlug(input.fromEmailLocalPart);
    setDomainConnected(true);
    setEmailConnected(true);
  }

  return (
    <>
      <ProfileSectionShell
        description={section.description}
        icon={section.icon}
        title={section.label}
      >
        <SegmentedTabs
          items={integrationTabs}
          onValueChange={setActiveTab}
          value={activeTab}
        />

        <SettingsCard title={activeIntegration.title}>
          <div className="grid gap-3">
            {activeIntegration.connections.map((connection) => (
              <ConnectionCard
                connection={{
                  ...connection,
                  connected:
                    connection.action === "domain"
                      ? domainConnected
                      : connection.action === "email"
                        ? emailConnected
                        : connection.connected,
                }}
                key={connection.name}
                onClick={
                  connection.action === "domain"
                    ? () => setIsDomainSheetOpen(true)
                    : connection.action === "email"
                      ? () => setIsEmailSheetOpen(true)
                      : connection.action === "whatsapp"
                        ? () => setIsWhatsAppSheetOpen(true)
                        : undefined
                }
              />
            ))}
          </div>
        </SettingsCard>
      </ProfileSectionShell>

      <ConnectDomainSheet
        initialSlug={slug}
        onClose={() => setIsDomainSheetOpen(false)}
        onConnect={connectDomain}
        open={isDomainSheetOpen}
      />
      <ConnectEmailSheet
        initialFromEmailLocalPart={email.fromEmailLocalPart}
        initialReplyToEmail={email.replyToEmail}
        onClose={() => setIsEmailSheetOpen(false)}
        onConnect={connectEmail}
        open={isEmailSheetOpen}
      />
      <ConnectWhatsAppSheet
        onClose={() => setIsWhatsAppSheetOpen(false)}
        open={isWhatsAppSheetOpen}
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
