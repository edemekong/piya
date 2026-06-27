import { Link } from "@remix-run/react";
import { useCreateLeadRequestMutation } from "@piya/shared";
import {
  ArrowRight,
  BadgePercent,
  CalendarClock,
  Contact,
  Frown,
  Gift,
  Globe2,
  History,
  Mail,
  MessageSquareText,
  PackageCheck,
  Send,
  Smile,
  Store,
  Tags,
  Truck,
  Users,
  Workflow,
} from "lucide-react";
import { AppTextField, Button, cn } from "@piya/ui";
import { type FormEvent, useEffect, useState } from "react";
import {
  MarketingLayout,
  MarketingSection,
} from "./components";

const featureGroups = [
  {
    title: "Know every customer",
    description:
      "Names, channels, tags, preferences, and key dates in one profile.",
    icon: Contact,
  },
  {
    title: "Group the right people",
    description:
      "Build simple audiences from tags, loyalty, activity, and location.",
    icon: Tags,
  },
  {
    title: "Reward repeat buyers",
    description:
      "Create loyalty rewards, discounts, limits, and redemption rules.",
    icon: Gift,
  },
  {
    title: "Send at the right time",
    description:
      "Schedule broadcasts and trigger messages from customer moments.",
    icon: CalendarClock,
  },
  {
    title: "Use real channels",
    description:
      "Reach customers on WhatsApp, email, SMS, and the customer app.",
    icon: Send,
  },
  {
    title: "Keep the full story",
    description:
      "See messages, delivery status, and past replies before follow-up.",
    icon: History,
  },
];

const businessMoments = [
  {
    title: "First purchase",
    description: "Welcome new customers after their first purchase.",
    icon: Contact,
  },
  {
    title: "Saved dates",
    description:
      "Send birthday, anniversary, and win-back messages from saved customer dates.",
    icon: CalendarClock,
  },
  {
    title: "Repeat buyers",
    description:
      "Create loyalty rewards for repeat buyers and track who can redeem them.",
    icon: Gift,
  },
  {
    title: "Before replying",
    description:
      "Review a customer's WhatsApp, SMS, email, and app history before replying.",
    icon: History,
  },
];

const heroSignals = [
  { label: "WhatsApp", image: "/assets/whatsapp.png" },
  { label: "Email", icon: Mail },
  { label: "Discounts", icon: BadgePercent },
  { label: "Gifts", icon: Gift },
  { label: "Orders", icon: PackageCheck },
  { label: "Delivery", icon: Truck },
];

const heroRelationshipWords = ["Customer", "Contact", "Buyer", "Shopper"];
const heroCampaignWords = ["campaigns", "discounts", "gifts", "loyalty"];
const heroConversationWords = ["conversations", "sales", "orders", "delivery"];

const marketRows = [
  { market: "Nigeria", status: "Live", active: true },
  { market: "Ghana", status: "Soon", active: false },
  { market: "Kenya", status: "Soon", active: false },
  { market: "South Africa", status: "Soon", active: false },
];

const featureCardRotations = [
  "lg:-rotate-1",
  "lg:rotate-1",
  "lg:-rotate-1",
  "lg:rotate-2",
  "lg:-rotate-1",
  "lg:rotate-1",
];

const steps = [
  {
    title: "Create your business profile",
    description:
      "Add business name, contact channels, locations, and brand details.",
    icon: Store,
  },
  {
    title: "Add contacts and offers",
    description:
      "Import contacts, add products and services, then create discounts, gifts, or loyalty rewards.",
    icon: Gift,
  },
  {
    title: "Send and track",
    description:
      "Schedule messages, follow WhatsApp, email, and SMS updates, and see history.",
    icon: Send,
  },
];

const setupPreviewItems = [
  { label: "Products", icon: PackageCheck },
  { label: "Services", icon: Store },
  { label: "Discounts", icon: BadgePercent },
  { label: "Loyalty", icon: Gift },
];

const comparisonItems = {
  without: [
    "Customer details spread across chats, notes, and spreadsheets",
    "Manual follow-ups after orders, birthdays, and delivery updates",
    "Discounts, gifts, and loyalty rewards tracked by memory",
  ],
  with: [
    "Contacts, tags, dates, and message history in one profile",
    "Scheduled WhatsApp, email, and SMS follow-ups",
    "Products, services, discounts, gifts, and loyalty connected",
    "Replies and customer context ready before the next sale",
  ],
};

export function LandingPage() {
  const [heroWordIndex, setHeroWordIndex] = useState(0);
  const [marketEmail, setMarketEmail] = useState("");
  const [marketRequestMessage, setMarketRequestMessage] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);
  const [createLeadRequest, marketRequestState] =
    useCreateLeadRequestMutation();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroWordIndex((current) => (current + 1) % heroRelationshipWords.length);
    }, 5600);

    return () => window.clearInterval(intervalId);
  }, []);

  async function submitMarketReminder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMarketRequestMessage(null);

    try {
      await createLeadRequest({
        type: "remind_me",
        data: { email: marketEmail.trim() },
      }).unwrap();
      setMarketEmail("");
      setMarketRequestMessage({
        type: "success",
        text: "Thanks. We will let you know when Piya is available.",
      });
    } catch (error) {
      setMarketRequestMessage({
        type: "error",
        text: getLeadRequestErrorMessage(error),
      });
    }
  }

  return (
    <MarketingLayout>
      <section className="bg-background">
        <div className="mx-auto flex min-h-[90vh] max-w-5xl flex-col items-center justify-center px-5 py-16 text-center sm:px-6 lg:py-24">
          <div>
            <h1 className="text-[50px] font-bold leading-[1.04] text-[#2F4B4F] sm:text-[72px]">
              <RotatingHeroWord value={heroRelationshipWords[heroWordIndex]} /> relationships,{" "}
              <RotatingHeroWord value={heroCampaignWords[heroWordIndex]} />, and{" "}
              <RotatingHeroWord value={heroConversationWords[heroWordIndex]} /> in one place.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-callout leading-8 text-text-secondary sm:text-body">
              Piya helps businesses manage contacts, loyalty campaigns,
              discounts, and customer messages across WhatsApp, email, SMS, and
              the Piya app.
            </p>
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
              {heroSignals.map((item) => {
                const Icon = "icon" in item ? item.icon : null;

                return (
                  <div
                    className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-transparent px-4 py-2 text-subheadline font-semibold text-[#2F4B4F]"
                    key={item.label}
                  >
                    {"image" in item ? (
                      <img
                        alt=""
                        className="size-4 object-contain"
                        src={item.image}
                      />
                    ) : Icon ? (
                      <Icon className="size-4 text-primary" />
                    ) : null}
                    {item.label}
                  </div>
                );
              })}
            </div>
            <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild>
                <a
                  href="https://dashboard.piya.store"
                  rel="noreferrer"
                  target="_blank"
                >
                  Create your account
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">Contact us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-subheadline font-semibold text-secondary">
              What Piya helps you do
            </p>
            <h2 className="mt-3 text-[38px] font-bold leading-[1.05] sm:text-[52px]">
              Built for customer follow-up.
            </h2>
            <p className="mt-5 text-callout leading-8 text-white/75">
              Start with contacts, campaigns, messages, and conversations.
              Grow into more markets and channels when your business is ready.
            </p>

            <div className="mt-10 rounded-md border border-white/15 bg-white/5">
              {marketRows.map((row) => (
                <div
                  className="flex items-center justify-between border-b border-white/10 px-4 py-4 last:border-b-0"
                  key={row.market}
                >
                  <div className="flex items-center gap-3">
                    <Globe2 className="size-4 text-secondary" />
                    <p className="text-callout font-semibold">{row.market}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {row.active && <span className="size-2 rounded-full bg-secondary" />}
                    <span className="text-caption-1 font-bold uppercase text-white/65">
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-headline font-semibold">
                Want Piya in your market?
              </p>
              <form
                className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]"
                onSubmit={submitMarketReminder}
              >
                <AppTextField
                  className="[&_span]:text-white/70"
                  inputClassName="border-white/15 bg-white/10 text-white placeholder:text-white/45 focus:border-secondary focus:bg-white/15"
                  label="Email"
                  name="email"
                  onChange={(event) => setMarketEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={marketEmail}
                />
                <Button
                  buttonState={
                    marketRequestState.isLoading ? "loading" : "enabled"
                  }
                  className="self-end bg-secondary text-primary hover:bg-secondary-light"
                  loadingLabel="Saving request"
                  type="submit"
                >
                  Notify me
                </Button>
                {marketRequestMessage ? (
                  <p
                    className={cn(
                      "text-subheadline font-semibold sm:col-span-2",
                      marketRequestMessage.type === "success"
                        ? "text-secondary"
                        : "text-error",
                    )}
                  >
                    {marketRequestMessage.text}
                  </p>
                ) : null}
              </form>
            </div>
          </div>

          <div className="grid gap-5 lg:min-h-[1320px] lg:gap-0">
            {featureGroups.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article
                  className={cn(
                    "rounded-md border-2 border-secondary/80 bg-white p-5 text-[#2F4B4F] shadow-lg lg:sticky lg:min-h-[300px] lg:p-7",
                    index > 0 && "lg:mt-8",
                    featureCardRotations[index],
                  )}
                  key={feature.title}
                  style={{
                    top: `${96 + index * 18}px`,
                    zIndex: index + 1,
                  }}
                >
                  <div className="grid size-11 place-items-center rounded-md bg-secondary text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 max-w-sm text-title-2 font-bold leading-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-3 max-w-md text-callout leading-7 text-text-secondary">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <MarketingSection
        className="bg-white"
        description="Use Piya when your business needs customer context before sending messages, launching offers, or following up."
        eyebrow="Built for growing businesses"
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div
            className="relative min-h-[460px] overflow-hidden rounded-md border border-border bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/business-operations.jpg')" }}
          >
            <div className="absolute inset-0 bg-primary/70" />
            <div className="relative flex min-h-[460px] flex-col justify-end p-6 text-white">
              <div className="flex items-start gap-3 text-secondary">
                <MessageSquareText className="mt-1 size-7 shrink-0" />
                <h3 className="text-title-2 font-semibold">
                  Keep marketing tied to real customer history.
                </h3>
              </div>
              <p className="mt-3 max-w-md text-callout leading-7 text-white/85">
                Piya is built around customer records, not isolated broadcasts.
                Teams can see who a message is for, which campaign it belongs to,
                and what happened before the next reply.
              </p>
            </div>
          </div>

          <div className="relative pl-12">
            <div className="business-timeline-line absolute bottom-7 left-[14px] top-7 w-0.5 overflow-hidden rounded-full bg-border" />
            <div className="grid gap-8">
              {businessMoments.map((moment) => {
                const Icon = moment.icon;

                return (
                  <article
                    className="relative py-1"
                    key={moment.title}
                  >
                    <div className="absolute -left-12 top-1 grid size-7 place-items-center rounded-full border-2 border-secondary bg-white text-primary">
                      <Icon className="size-4" />
                    </div>
                    <h3 className="text-headline font-semibold text-[#2F4B4F]">
                      {moment.title}
                    </h3>
                    <p className="mt-2 text-callout leading-7 text-text-secondary">
                      {moment.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection
        description="Set up the basics, add the people and offers that matter, then keep every message tied to real customer activity."
        eyebrow="How it works"
        title="Three steps from setup to follow-up"
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="relative">
            <div className="setup-flow-line absolute bottom-7 left-5 top-7 w-0.5 overflow-hidden rounded-full bg-border" />
            <div className="grid gap-7">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article className="relative pl-16" key={step.title}>
                    <div className="absolute left-0 top-0 grid size-10 place-items-center rounded-full border-2 border-secondary bg-white text-primary">
                      <span className="text-callout font-bold">{index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <Icon className="size-5" />
                      <h3 className="text-headline font-semibold text-[#2F4B4F]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-2 max-w-xl text-callout leading-7 text-text-secondary">
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div
            className="relative min-h-[460px] overflow-hidden rounded-md border-2 border-secondary/80 bg-cover bg-center shadow-sm"
            style={{ backgroundImage: "url('/assets/campaign.jpg')" }}
          >
            <div className="absolute inset-0 bg-primary/70" />
            <div className="relative flex min-h-[460px] flex-col justify-end p-6 text-white">
              <div className="flex items-center gap-3 text-secondary">
                <Workflow className="size-7 shrink-0" />
                <div>
                  <h3 className="flex items-start gap-2 text-title-2 font-semibold text-secondary">
                    <Contact className="mt-1 size-6 shrink-0" />
                    Profile, contacts, offers, and messages connected.
                  </h3>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {setupPreviewItems.map((item) => {
                  const Icon = item.icon;

                  return (
                  <span
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-subheadline font-semibold text-white"
                    key={item.label}
                  >
                    <Icon className="size-4 text-secondary" />
                    {item.label}
                  </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </MarketingSection>

      <MarketingSection
        className="bg-white"
      >
        <p className="mx-auto mb-8 max-w-3xl text-center text-callout leading-7 text-text-secondary">
          Piya brings customer work into one place, so the small daily tasks do
          not depend on memory.
        </p>
        <div
          aria-label="Piya comparison"
          className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-0"
        >
          <article className="relative z-10 min-h-72 rounded-md border border-[#D7D7D2] bg-[#F2F2EF] p-5 text-[#858580] sm:origin-bottom-right sm:-rotate-2">
            <h2 className="text-headline font-bold text-[#757570]">
              Without Piya
            </h2>
            <ul className="mt-5 grid gap-3 pl-5 text-subheadline leading-6">
              {comparisonItems.without.map((item) => (
                <li className="list-disc" key={item}>
                  {item}
                </li>
              ))}
            </ul>
            <Frown className="mx-auto mt-8 size-9 text-[#9B9B95]" />
          </article>

          <article className="relative z-20 min-h-72 rounded-md border-2 border-primary bg-secondary p-5 text-primary shadow-xl sm:-ml-10 sm:origin-bottom-left sm:rotate-2">
            <h2 className="text-headline font-bold text-primary">With Piya</h2>
            <ul className="mt-5 grid gap-3 pl-5 text-subheadline font-semibold leading-6">
              {comparisonItems.with.map((item) => (
                <li className="list-disc" key={item}>
                  {item}
                </li>
              ))}
            </ul>
            <Smile className="mx-auto mt-8 size-9 text-primary" />
          </article>
        </div>
      </MarketingSection>

      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="mt-4 text-title-1 font-semibold">
              Bring your customer relationships into one practical workspace.
            </h2>
            <p className="mt-3 max-w-2xl text-callout leading-7 text-white/80">
              Contact us to create a Piya account or ask questions about using
              Piya for contact management, campaigns, loyalty, and customer
              communications.
            </p>
          </div>
          <Button asChild className="bg-secondary text-primary hover:bg-secondary-light">
            <a
              href="https://dashboard.piya.store"
              rel="noreferrer"
              target="_blank"
            >
              Get started
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </section>
    </MarketingLayout>
  );
}

function RotatingHeroWord({ value }: { value: string }) {
  return (
    <span
      className="hero-rotating-word relative inline-block text-primary"
      key={value}
    >
      {value}
    </span>
  );
}

function getLeadRequestErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Could not save your request. Please try again.";
}
