import { MarketingLayout, MarketingSection } from "./components";

const termsSections = [
  {
    title: "Operator and product",
    body: "Piya is a product operated by Yina Store Ltd. These starter terms describe basic expectations for using Piya and should be reviewed by legal counsel before broad commercial use.",
  },
  {
    title: "Use of Piya",
    body: "Businesses and authorized users may use Piya to manage business profiles, contacts, segments, campaigns, communications, and customer conversation history. Users should provide accurate account and business information.",
  },
  {
    title: "Customer communications",
    body: "Businesses are responsible for ensuring they have the right permissions and lawful basis to contact customers through email, SMS, WhatsApp, the customer app, or other connected channels.",
  },
  {
    title: "Acceptable use",
    body: "Users should not use Piya to send unlawful, misleading, harmful, abusive, or unauthorized communications, or to interfere with the reliability or security of the service.",
  },
  {
    title: "Service changes",
    body: "Piya may change, improve, or discontinue features as the product develops. We aim to communicate material changes through appropriate product or support channels.",
  },
  {
    title: "Contact",
    body: "Questions about these terms can be sent to support@piya.store.",
  },
];

export function TermsPage() {
  return (
    <MarketingLayout>
      <MarketingSection
        className="border-t-0"
        description="These Terms of Service are a practical starter for early product review. They are not a substitute for legal advice."
        eyebrow="Terms of Service"
        title="Basic terms for using Piya"
      >
        <div className="grid max-w-4xl gap-4">
          {termsSections.map((section) => (
            <article className="rounded-md border border-border bg-white p-5" key={section.title}>
              <h2 className="text-headline font-semibold text-[#2F4B4F]">
                {section.title}
              </h2>
              <p className="mt-2 text-callout leading-7 text-text-secondary">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </MarketingSection>
    </MarketingLayout>
  );
}
