import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  Globe2,
  MessageCircle,
  MoreVertical,
  Palette,
  Send,
  Truck,
  Upload,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import {
  showToast,
  type AppDispatch,
  userService,
} from "@piya/shared";
import {
  AppAvatar,
  Badge,
  Button,
  SegmentedTabs,
  SettingsCard,
  cn,
} from "@piya/ui";
import { useDispatch } from "react-redux";
import {
  FieldGrid,
  ProfileField,
  ProfileSelect,
  ProfileTextarea,
} from "@/pages/profile/components/ProfileFields";
import {
  DEFAULT_AUTHENTICATED_PATH,
  getReturnToFromSearch,
  getSafeReturnTo,
} from "@/utils/auth-routing";
import { useAdminAuthRedirect } from "@/utils/use-admin-auth-redirect";

type SetupStep = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  optional?: boolean;
};

const setupSteps: SetupStep[] = [
  {
    id: "personal-info",
    title: "Personal info",
    description: "Your name and admin contact details",
    icon: Users,
  },
  {
    id: "business-profile",
    title: "Business profile",
    description: "Store identity and operating details",
    icon: Building2,
  },
  {
    id: "brand-details",
    title: "Brand details",
    description: "Tone, visuals, and customer promise",
    icon: Palette,
    optional: true,
  },
  {
    id: "integration",
    title: "Integration",
    description: "Connect the services your workspace depends on",
    icon: MessageCircle,
    optional: true,
  },
  {
    id: "team",
    title: "Team",
    description: "Invite teammates and assign roles",
    icon: Users,
    optional: true,
  },
];

const businessCategories = [
  { label: "Laundry", value: "laundry" },
  { label: "Fashion tailoring", value: "fashion_tailoring" },
  { label: "Salon", value: "salon" },
  { label: "Barbershop", value: "barbershop" },
  { label: "Spa", value: "spa" },
  { label: "Beauty studio", value: "beauty_studio" },
  { label: "Car wash", value: "car_wash" },
  { label: "Logistics delivery", value: "logistics_delivery" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Food vendor", value: "food_vendor" },
  { label: "Supermarket", value: "supermarket" },
  { label: "Farm produce", value: "farm_produce" },
  { label: "Fashion store", value: "fashion_store" },
  { label: "Electronics store", value: "electronics_store" },
  { label: "Photography", value: "photography" },
  { label: "Consulting", value: "consulting" },
  { label: "Real estate agent", value: "real_estate_agent" },
  { label: "Hotel guesthouse", value: "hotel_guesthouse" },
  { label: "Shortlet apartment", value: "shortlet_apartment" },
];

const brandColors = [
  { label: "Primary color", value: "#2F4B4F" },
  { label: "Secondary color", value: "#F4C95D" },
  { label: "Accent color", value: "#F6F8F7" },
];

const members = [
  { email: "amara@example.com", name: "Amara Okafor", role: "Admin" },
  { email: "tunde@example.com", name: "Tunde Balogun", role: "Support" },
  { email: "maya@example.com", name: "Maya Chen", role: "Marketing" },
];

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

export function AccountSetupPage() {
  const authStatus = useAdminAuthRedirect("account-setup");
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isFinishingSetup, setIsFinishingSetup] = useState(false);
  const currentStep = setupSteps[activeStep];
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === setupSteps.length - 1;
  const isOptionalStep = currentStep.optional === true;

  function showPreviousStep() {
    setActiveStep((current) => Math.max(current - 1, 0));
  }

  function showNextStep() {
    setActiveStep((current) => Math.min(current + 1, setupSteps.length - 1));
  }

  async function finishSetup() {
    setIsFinishingSetup(true);

    try {
      await userService.updateUser({ accountSetupCompleted: true });
      const returnTo = getSafeReturnTo(
        getReturnToFromSearch(location.search),
        DEFAULT_AUTHENTICATED_PATH,
      );
      navigate(returnTo, { replace: true });
    } catch (error) {
      showToast(dispatch, {
        message: getAccountSetupErrorMessage(error),
        variant: "error",
      });
    } finally {
      setIsFinishingSetup(false);
    }
  }

  if (authStatus !== "ready") return null;

  return (
    <main className="min-h-screen bg-background px-10 py-10 text-foreground">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1160px] flex-col">
        <div className="grid flex-1 items-start gap-[13px] lg:grid-cols-[320px_1fr]">
          <aside className="sticky top-10 flex max-h-[calc(100vh-80px)] flex-col self-start pb-card pl-0 pr-card pt-0">
            <p className="pl-2 text-title3 font-semibold text-primary">
              Account setup
            </p>

            <div className="mt-8 space-y-2">
              {setupSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === activeStep;
                const isComplete = index < activeStep;

                return (
                  <button
                    className={cn(
                      "group grid w-full grid-cols-[32px_1fr] gap-3 p-2 text-left transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                      isActive && "text-primary",
                    )}
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    type="button"
                  >
                    <span className="relative flex justify-center">
                      {index < setupSteps.length - 1 ? (
                        <span
                          className={cn(
                            "absolute left-1/2 top-8 h-[calc(100%+8px)] w-px -translate-x-1/2 bg-border",
                            isComplete && "bg-primary",
                          )}
                        />
                      ) : null}
                      <span
                        className={cn(
                          "relative z-10 flex size-8 items-center justify-center rounded-full border bg-white text-text-tertiary transition",
                          isActive && "border-primary bg-primary text-white",
                          isComplete &&
                            "border-primary bg-secondary text-primary",
                        )}
                      >
                        {isComplete ? (
                          <Check className="size-4" />
                        ) : (
                          <StepIcon className="size-4" />
                        )}
                      </span>
                    </span>

                    <span className="min-w-0 pt-1.5">
                      <span
                        className={cn(
                          "block text-footnote font-normal text-[#2F4B4F]",
                          isActive && "font-semibold text-primary",
                        )}
                      >
                        {step.title}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-8">
              <span className="inline-flex rounded-full bg-secondary px-4 py-2 text-footnote font-semibold text-primary">
                {Math.round(((activeStep + 1) / setupSteps.length) * 100)}%
                complete
              </span>
            </div>
          </aside>

          <section className="flex min-h-[calc(100vh-80px)] flex-col rounded-lg bg-white p-card">
            <div className="flex items-start justify-between gap-4 pb-4">
              <div className="space-y-1">
                <h2 className="text-title1 font-semibold text-[#102F34]">
                  {currentStep.title}
                </h2>
                <p className="text-callout leading-relaxed text-text-secondary">
                  {currentStep.description}
                </p>
              </div>
              <p className="shrink-0 text-footnote font-semibold text-primary">
                {activeStep + 1} of {setupSteps.length}
              </p>
            </div>

            <form
              className="flex flex-1 flex-col"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="flex-1 py-6">
                <StepContent activeStep={activeStep} />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  disabled={isFirstStep}
                  icon={<ArrowLeft />}
                  onClick={showPreviousStep}
                  type="button"
                  variant="secondary"
                >
                  Back
                </Button>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                  {isOptionalStep ? (
                    <button
                      className="text-callout font-semibold text-primary underline underline-offset-4 transition hover:text-[#2F4B4F]"
                      onClick={showNextStep}
                      type="button"
                    >
                      Skip for now
                    </button>
                  ) : null}

                  <Button
                    disabled={isFinishingSetup}
                    onClick={isLastStep ? finishSetup : showNextStep}
                    trailing={<ArrowRight />}
                    type="button"
                  >
                    {isLastStep
                      ? isFinishingSetup
                        ? "Finishing..."
                        : "Finish setup"
                      : "Continue"}
                  </Button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}

function getAccountSetupErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to finish account setup. Please try again.";
}

function StepContent({ activeStep }: { activeStep: number }) {
  switch (activeStep) {
    case 0:
      return <PersonalInfoStep />;
    case 1:
      return <BusinessProfileStep />;
    case 2:
      return <BrandDetailsStep />;
    case 3:
      return <IntegrationStep />;
    case 4:
      return <TeamStep />;
    default:
      return null;
  }
}

function PersonalInfoStep() {
  return (
    <div className="max-w-[820px] space-y-4">
      <SettingsCard title="Profile image">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <UserRound className="size-9" />
            </span>
            <div>
              <p className="font-semibold text-[#2F4B4F]">Ada Okafor</p>
              <p className="mt-1 text-callout text-[#2F4B4F]/65">
                JPG, PNG, or WebP. Recommended size 400x400.
              </p>
            </div>
          </div>
          <Button icon={<Upload />} size="sm" type="button" variant="secondary">
            Upload image
          </Button>
        </div>
      </SettingsCard>

      <SettingsCard title="Personal information">
        <FieldGrid>
          <ProfileField label="First name" placeholder="Ada" />
          <ProfileField label="Last name" placeholder="Okafor" />
          <ProfileField
            label="Email"
            placeholder="ada@example.com"
            type="email"
          />
          <ProfileField
            label="Phone number"
            placeholder="+234 801 234 5678"
            type="tel"
          />
        </FieldGrid>
      </SettingsCard>
    </div>
  );
}

function BusinessProfileStep() {
  return (
    <div className="max-w-[820px] space-y-4">
      <SettingsCard title="Business identity">
        <FieldGrid>
          <ProfileField label="Business name" value="Piya Store" />
          <ProfileSelect
            label="Business category"
            options={businessCategories}
            value="fashion_store"
          />
          <div className="md:col-span-2">
            <ProfileField label="Public domain" value="piya.store" />
          </div>
        </FieldGrid>
        <ProfileTextarea
          label="Business description"
          value="Customer commerce, ordering, and messaging in one admin workspace."
        />
      </SettingsCard>

      <SettingsCard title="Business contact">
        <FieldGrid>
          <ProfileField
            label="Business email"
            type="email"
            value="hello@piya.store"
          />
          <ProfileField
            label="Business phone"
            type="tel"
            value="+234 802 000 0000"
          />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Service locations">
        <button
          className="flex h-12 w-full items-center justify-center rounded-sm border border-dashed border-[#2F4B4F]/25 bg-fill text-callout font-semibold text-[#2F4B4F]/65 transition hover:border-primary hover:bg-white hover:text-primary"
          type="button"
        >
          Add locations you operate
        </button>
      </SettingsCard>
    </div>
  );
}

function BrandDetailsStep() {
  return (
    <div className="max-w-[820px] space-y-4">
      <SettingsCard title="Brand assets">
        <FieldGrid>
          <ProfileField label="Logo URL" value="/assets/logo.png" />
          <ProfileField label="Favicon URL" value="/favicon.ico" />
          <ProfileField label="Cover image URL" value="/assets/cover.png" />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Social links">
        <FieldGrid>
          <ProfileField label="Instagram" value="@piya" />
          <ProfileField label="X / Twitter" value="@piya" />
          <ProfileField label="Facebook" value="https://facebook.com/piya" />
          <ProfileField
            label="LinkedIn"
            value="https://linkedin.com/company/piya"
          />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Brand colors">
        <div className="grid gap-4 sm:grid-cols-3">
          {brandColors.map((color) => (
            <label className="grid min-w-0 gap-2" key={color.label}>
              <span className="text-footnote font-normal text-[#2F4B4F]">
                {color.label}
              </span>
              <span className="flex h-12 min-w-0 items-center gap-3 rounded-sm border border-border bg-fill px-3">
                <span
                  className="size-6 rounded-full border border-border"
                  style={{ backgroundColor: color.value }}
                />
                <input
                  className="my-2 min-w-0 flex-1 bg-transparent text-callout text-[#2F4B4F] outline-none"
                  defaultValue={color.value}
                />
              </span>
            </label>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}

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

function TeamStep() {
  return (
    <div className="max-w-[820px] space-y-4">
      <SettingsCard
        actions={
          <Button icon={<Send />} size="sm" type="button">
            Send invite
          </Button>
        }
        title="Invite teammate"
      >
        <FieldGrid className="md:grid-cols-[minmax(0,1fr)_220px]">
          <ProfileField
            label="Email address"
            placeholder="teammate@example.com"
          />
          <ProfileSelect
            label="Role"
            options={["Admin", "Manager"]}
            value="Admin"
          />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Team members">
        <div className="grid gap-2">
          {members.map((member) => (
            <div
              className="flex items-center gap-3 rounded-md bg-fill px-3 py-3"
              key={member.email}
            >
              <AppAvatar className="size-10" name={member.name} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#2F4B4F]">{member.name}</p>
                <p className="truncate text-footnote text-[#2F4B4F]/60">
                  {member.email}
                </p>
              </div>
              <Badge>{member.role}</Badge>
              <button
                aria-label={`Open actions for ${member.name}`}
                className="flex size-8 items-center justify-center rounded-full text-[#2F4B4F]/60 hover:bg-white"
                type="button"
              >
                <MoreVertical className="size-4" />
              </button>
            </div>
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
