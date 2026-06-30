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
import { useEffect, useMemo, useState } from "react";
import {
  availabilityDataToScheduleDraft,
  type AvailabilityScheduleDraft,
  type UpdateDeliveryPricingInput,
  getBusinessSlug,
  useGetPrimaryAvailabilityQuery,
  useGetPrimaryDeliveryPricingQuery,
  useUpdatePrimaryAvailabilityMutation,
  useUpdatePrimaryDeliveryPricingMutation,
} from "@piya/shared";
import {
  ConnectAvailabilitySheet,
  ConnectDeliveryPricingSheet,
  ConnectDomainSheet,
  ConnectEmailSheet,
  ConnectWhatsAppSheet,
} from "@/pages/profile/components";
import {
  shouldShowAvailabilityIntegration,
  shouldShowDeliveryIntegration,
} from "@/pages/auth/utils/account-setup-options";
import type { SetupDraft } from "@/pages/auth/utils/account-setup-types";

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

type IntegrationStepProps = {
  draft: SetupDraft;
  setDraft: React.Dispatch<React.SetStateAction<SetupDraft>>;
};

function IntegrationStep({ draft, setDraft }: IntegrationStepProps) {
  const [activeTab, setActiveTab] = useState<IntegrationTab>("domain");
  const [isDomainSheetOpen, setIsDomainSheetOpen] = useState(false);
  const [isEmailSheetOpen, setIsEmailSheetOpen] = useState(false);
  const [isWhatsAppSheetOpen, setIsWhatsAppSheetOpen] = useState(false);
  const [isAvailabilitySheetOpen, setIsAvailabilitySheetOpen] = useState(false);
  const [isDeliveryPricingSheetOpen, setIsDeliveryPricingSheetOpen] =
    useState(false);
  const [availabilitySchedule, setAvailabilitySchedule] =
    useState<AvailabilityScheduleDraft>();
  const { data: availabilityPayload } = useGetPrimaryAvailabilityQuery();
  const { data: deliveryPricingPayload } = useGetPrimaryDeliveryPricingQuery();
  const [updateAvailability, { isLoading: isSavingAvailability }] =
    useUpdatePrimaryAvailabilityMutation();
  const [updateDeliveryPricing, { isLoading: isSavingDeliveryPricing }] =
    useUpdatePrimaryDeliveryPricingMutation();
  const visibleIntegrationTabs = useMemo(
    () =>
      integrationTabs.filter(
        (tab) =>
          tab.value === "domain" ||
          tab.value === "message-channel" ||
          (tab.value === "availability" &&
            shouldShowAvailabilityIntegration(draft.businessProfile.category)) ||
          (tab.value === "delivery" &&
            shouldShowDeliveryIntegration(draft.businessProfile.category)),
      ),
    [draft.businessProfile.category],
  );
  const activeIntegration = integrationsByTab[activeTab];
  const savedAvailabilitySchedule = availabilityDataToScheduleDraft(
    availabilityPayload?.availability
  );
  const currentAvailabilitySchedule =
    availabilitySchedule ?? savedAvailabilitySchedule;
  const deliveryPricing = deliveryPricingPayload?.deliveryPricing;
  const suggestedSlug =
    draft.integration.slug || getBusinessSlug(draft.businessProfile.name);
  const suggestedFromEmailLocalPart =
    draft.integration.email.fromEmailLocalPart || suggestedSlug;
  const suggestedReplyToEmail =
    draft.integration.email.replyToEmail || draft.businessProfile.email || "";

  useEffect(() => {
    if (visibleIntegrationTabs.some((tab) => tab.value === activeTab)) return;

    setActiveTab(visibleIntegrationTabs[0]?.value ?? "domain");
  }, [activeTab, visibleIntegrationTabs]);

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

  async function saveAvailability(schedule: AvailabilityScheduleDraft) {
    const result = await updateAvailability(schedule).unwrap();
    setAvailabilitySchedule(
      availabilityDataToScheduleDraft(result.availability) ?? schedule
    );
  }

  async function saveDeliveryPricing(input: UpdateDeliveryPricingInput) {
    await updateDeliveryPricing(input).unwrap();
  }

  return (
    <>
      <div className="max-w-[820px] space-y-4">
        <SegmentedTabs
          items={visibleIntegrationTabs}
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
                  : connection.action === "availability-hours"
                  ? Boolean(currentAvailabilitySchedule)
                  : connection.action === "delivery-prices"
                  ? Object.values(deliveryPricing?.vehicles ?? {}).some(
                      (vehicle) => vehicle.enabled
                    )
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
                      : connection.action === "whatsapp"
                      ? () => setIsWhatsAppSheetOpen(true)
                      : connection.action === "availability-hours"
                      ? () => setIsAvailabilitySheetOpen(true)
                      : connection.action === "delivery-prices"
                      ? () => setIsDeliveryPricingSheetOpen(true)
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
        businessName={draft.businessProfile.name}
        initialFromEmailLocalPart={suggestedFromEmailLocalPart}
        initialReplyToEmail={suggestedReplyToEmail}
        onClose={() => setIsEmailSheetOpen(false)}
        onConnect={connectEmail}
        open={isEmailSheetOpen}
      />
      <ConnectWhatsAppSheet
        onClose={() => setIsWhatsAppSheetOpen(false)}
        onDisconnect={() => undefined}
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
