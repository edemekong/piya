import { Building2, MessagesSquare, ShieldCheck } from "lucide-react";
import { MarketingLayout, MarketingSection } from "./components";

const aboutPoints = [
  {
    title: "Customer records",
    description:
      "Piya gives businesses a place to organize customer details, tags, preferences, and relationship history.",
    icon: Building2,
  },
  {
    title: "Campaign and loyalty tooling",
    description:
      "Teams can plan discounts, rewards, audience rules, and customer-triggered communication from one workflow.",
    icon: ShieldCheck,
  },
  {
    title: "Conversation context",
    description:
      "Email, SMS, WhatsApp, and app conversations can stay connected to the customer profile they belong to.",
    icon: MessagesSquare,
  },
];

export function AboutPage() {
  return (
    <MarketingLayout>
      <MarketingSection
        className="border-t-0"
        description="Piya is a customer relationship, campaign, loyalty, and communication workspace for businesses that need practical customer follow-up without scattered tools."
        eyebrow="About Piya"
        title="Customer operations for growing businesses"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {aboutPoints.map((point) => {
            const Icon = point.icon;
            return (
              <article className="rounded-md border border-border bg-white p-5" key={point.title}>
                <Icon className="size-6 text-primary" />
                <h2 className="mt-4 text-headline font-semibold text-[#2F4B4F]">
                  {point.title}
                </h2>
                <p className="mt-2 text-subheadline leading-6 text-text-secondary">
                  {point.description}
                </p>
              </article>
            );
          })}
        </div>
      </MarketingSection>

      <MarketingSection className="bg-white" title="Operated by Yina Store Ltd.">
        <div className="max-w-3xl rounded-md border border-border bg-fill/40 p-6">
          <p className="text-callout leading-7 text-text-secondary">
            Piya is the product and brand used for this customer operations
            platform. The legal operator is Yina Store Ltd. For product,
            support, privacy, or account questions, contact{" "}
            <a
              className="font-semibold text-primary underline underline-offset-4"
              href="mailto:support@piya.store"
            >
              support@piya.store
            </a>
            .
          </p>
        </div>
      </MarketingSection>
    </MarketingLayout>
  );
}
