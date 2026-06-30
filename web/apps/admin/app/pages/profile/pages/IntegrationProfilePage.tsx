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
  type AccountSetupEmailIntegrationInput,
  type AvailabilityScheduleDraft,
  type UpdateDeliveryPricingInput,
  availabilityDataToScheduleDraft,
  type WhatsAppChannelSettings,
  useGetAccountSetupQuery,
  useGetPrimaryAvailabilityQuery,
  useGetPrimaryDeliveryPricingQuery,
  useGetWhatsAppConnectionQuery,
  useUpdateAccountSetupMutation,
  useUpdatePrimaryAvailabilityMutation,
  useUpdatePrimaryDeliveryPricingMutation,
  useDisconnectWhatsAppConnectionMutation,
} from "@piya/shared";
import { ConnectAvailabilitySheet } from "../components/ConnectAvailabilitySheet";
import { ConnectDeliveryPricingSheet } from "../components/ConnectDeliveryPricingSheet";
import { ConnectDomainSheet } from "../components/ConnectDomainSheet";
import { ConnectEmailSheet } from "../components/ConnectEmailSheet";
import { ConnectWhatsAppSheet } from "../components/ConnectWhatsAppSheet";
import { profileMenuItems } from "../profileSections";
import { SettingsCard, SettingsSection as ProfileSectionShell } from "@piya/ui";
import {
  shouldShowAvailabilityIntegration,
  shouldShowDeliveryIntegration,
} from "@/pages/auth/utils/account-setup-options";

const section = profileMenuItems.find((item) => item.value === "channels")!;

type IntegrationTab =
  | "domain"
  | "message-channel"
  | "availability"
  | "delivery";

type IntegrationConnection = {
  action?:
    | "availability-hours"
    | "delivery-prices"
    | "domain"
    | "email"
    | "whatsapp";
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
        action: "availability-hours",
        name: "Set up available hours",
        subtitle: "Choose the days and times clients can book with you.",
      },
    ],
  },
  delivery: {
    title: "Delivery integration",
    connections: [
      {
        action: "delivery-prices",
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
  const [isAvailabilitySheetOpen, setIsAvailabilitySheetOpen] =
    React.useState(false);
  const [isDeliveryPricingSheetOpen, setIsDeliveryPricingSheetOpen] =
    React.useState(false);
  const [availabilitySchedule, setAvailabilitySchedule] =
    React.useState<AvailabilityScheduleDraft>();
  const [slug, setSlug] = React.useState("");
  const [email, setEmail] = React.useState<AccountSetupEmailIntegrationInput>({
    fromEmailLocalPart: "",
    replyToEmail: "",
  });
  const { data: accountSetup, isLoading: isLoadingAccountSetup } =
    useGetAccountSetupQuery();
  const { data: availabilityPayload, isLoading: isLoadingAvailability } =
    useGetPrimaryAvailabilityQuery();
  const {
    data: deliveryPricingPayload,
    isLoading: isLoadingDeliveryPricing,
  } = useGetPrimaryDeliveryPricingQuery();
  const { data: whatsappConnection, isLoading: isLoadingWhatsApp } =
    useGetWhatsAppConnectionQuery();
  const [updateAccountSetup] = useUpdateAccountSetupMutation();
  const [updateAvailability, { isLoading: isSavingAvailability }] =
    useUpdatePrimaryAvailabilityMutation();
  const [updateDeliveryPricing, { isLoading: isSavingDeliveryPricing }] =
    useUpdatePrimaryDeliveryPricingMutation();
  const [disconnectWhatsApp, { isLoading: isDisconnectingWhatsApp }] =
    useDisconnectWhatsAppConnectionMutation();
  const activeIntegration = integrationsByTab[activeTab];
  const visibleIntegrationTabs = React.useMemo(
    () =>
      integrationTabs.filter(
        (tab) =>
          tab.value === "domain" ||
          tab.value === "message-channel" ||
          (tab.value === "availability" &&
            shouldShowAvailabilityIntegration(
              accountSetup?.business?.category,
            )) ||
          (tab.value === "delivery" &&
            shouldShowDeliveryIntegration(accountSetup?.business?.category)),
      ),
    [accountSetup?.business?.category],
  );
  const whatsappSettings =
    whatsappConnection?.connection ?? accountSetup?.channelSettings?.whatsapp;
  const savedAvailabilitySchedule = availabilityDataToScheduleDraft(
    availabilityPayload?.availability
  );
  const currentAvailabilitySchedule =
    availabilitySchedule ?? savedAvailabilitySchedule;
  const deliveryPricing = deliveryPricingPayload?.deliveryPricing;
  const isLoadingIntegrations =
    isLoadingAccountSetup ||
    isLoadingAvailability ||
    isLoadingDeliveryPricing ||
    isLoadingWhatsApp;

  React.useEffect(() => {
    if (!accountSetup) return;

    const savedSlug = accountSetup.business?.slug ?? "";
    const savedEmail = accountSetup.channelSettings?.email;
    setSlug(savedSlug);
    setDomainConnected(Boolean(savedSlug));
    setEmail({
      fromEmailLocalPart: savedSlug,
      replyToEmail: savedEmail?.replyToEmail ?? "",
    });
    setEmailConnected(Boolean(savedEmail));
  }, [accountSetup]);

  React.useEffect(() => {
    if (visibleIntegrationTabs.some((tab) => tab.value === activeTab)) return;

    setActiveTab(visibleIntegrationTabs[0]?.value ?? "domain");
  }, [activeTab, visibleIntegrationTabs]);

  async function connectDomain(nextSlug: string) {
    const result = await updateAccountSetup({
      step: "integration",
      input: { slug: nextSlug },
    }).unwrap();
    const savedSlug = result.business?.slug ?? nextSlug;

    setSlug(savedSlug);
    setEmail((current) => ({
      ...current,
      fromEmailLocalPart: savedSlug,
    }));
    setDomainConnected(true);
  }

  async function connectEmail(input: AccountSetupEmailIntegrationInput) {
    const result = await updateAccountSetup({
      step: "integration",
      input: {
        email: input,
        slug: input.fromEmailLocalPart,
      },
    }).unwrap();
    const savedSlug = result.business?.slug ?? input.fromEmailLocalPart;

    setEmail(input);
    setSlug(savedSlug);
    setDomainConnected(true);
    setEmailConnected(true);
  }

  async function saveAvailability(schedule: AvailabilityScheduleDraft) {
    const result = await updateAvailability(schedule).unwrap();
    setAvailabilitySchedule(
      availabilityDataToScheduleDraft(result.availability) ?? schedule
    );
  }

  async function saveDeliveryPricing(input: UpdateDeliveryPricingInput) {
    await updateDeliveryPricing(input).unwrap();
  }

  if (isLoadingIntegrations) {
    return (
      <ProfileSectionShell
        description={section.description}
        icon={section.icon}
        title={section.label}
      >
        <div
          aria-live="polite"
          className="flex min-h-40 items-center justify-center"
          role="status"
        >
          <span
            aria-hidden="true"
            className="size-7 animate-spin rounded-full border-2 border-primary border-t-transparent"
          />
          <span className="sr-only">Loading integrations</span>
        </div>
      </ProfileSectionShell>
    );
  }

  return (
    <>
      <ProfileSectionShell
        description={section.description}
        icon={section.icon}
        title={section.label}
      >
        <SegmentedTabs
          items={visibleIntegrationTabs}
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
                      : connection.action === "whatsapp"
                      ? isWhatsAppConnected(whatsappSettings)
                      : connection.action === "availability-hours"
                      ? Boolean(currentAvailabilitySchedule)
                      : connection.action === "delivery-prices"
                      ? Object.values(deliveryPricing?.vehicles ?? {}).some(
                          (vehicle) => vehicle.enabled
                        )
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
                    : connection.action === "availability-hours"
                    ? () => setIsAvailabilitySheetOpen(true)
                    : connection.action === "delivery-prices"
                    ? () => setIsDeliveryPricingSheetOpen(true)
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
        businessName={accountSetup?.business?.name ?? ""}
        initialFromEmailLocalPart={email.fromEmailLocalPart}
        initialReplyToEmail={email.replyToEmail}
        onClose={() => setIsEmailSheetOpen(false)}
        onConnect={connectEmail}
        open={isEmailSheetOpen}
      />
      <ConnectWhatsAppSheet
        connection={whatsappSettings}
        isDisconnecting={isDisconnectingWhatsApp}
        onClose={() => setIsWhatsAppSheetOpen(false)}
        onDisconnect={() => disconnectWhatsApp().unwrap()}
        open={isWhatsAppSheetOpen}
      />
      <ConnectAvailabilitySheet
        initialSchedule={currentAvailabilitySchedule}
        isSaving={isSavingAvailability}
        onClose={() => setIsAvailabilitySheetOpen(false)}
        onSave={saveAvailability}
        open={isAvailabilitySheetOpen}
      />
      <ConnectDeliveryPricingSheet
        initialPricing={deliveryPricing}
        isSaving={isSavingDeliveryPricing}
        onClose={() => setIsDeliveryPricingSheetOpen(false)}
        onSave={saveDeliveryPricing}
        open={isDeliveryPricingSheetOpen}
      />
    </>
  );
}

function isWhatsAppConnected(connection?: WhatsAppChannelSettings | null) {
  return connection?.status === "active" && Boolean(connection.phoneNumberId);
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
