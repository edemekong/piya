import { MarketingLayout, MarketingSection } from "./components";

const privacySections = [
  {
    title: "Who operates Piya",
    body: "Piya is operated by Yina Store Ltd. This policy explains how Piya may collect, use, and protect information when businesses and their authorized users use the product.",
  },
  {
    title: "Information we may collect",
    body: "We may collect account details, business profile information, contact details supplied by a business, campaign settings, communication preferences, support messages, and technical information needed to operate and secure the service.",
  },
  {
    title: "How information is used",
    body: "Information may be used to provide the Piya service, manage business accounts, support customer communication workflows, respond to support requests, improve product reliability, and meet legal or security obligations.",
  },
  {
    title: "Customer contact data",
    body: "Businesses are responsible for the customer contact data they add to Piya and for having appropriate permission to communicate with those customers through email, SMS, WhatsApp, the customer app, or other connected channels.",
  },
  {
    title: "Sharing and service providers",
    body: "Piya may use service providers to host infrastructure, deliver messages, process support requests, or operate product features. We do not include unsupported claims about selling data or third-party certifications on this starter page.",
  },
  {
    title: "Contact",
    body: "For privacy questions or requests, contact support@piya.store.",
  },
];

export function PrivacyPage() {
  return (
    <MarketingLayout>
      <MarketingSection
        className="border-t-0"
        description="This starter Privacy Policy is provided for early product and business review purposes and should be reviewed by legal counsel before broad commercial use."
        eyebrow="Privacy Policy"
        title="How Piya handles information"
      >
        <LegalContent sections={privacySections} />
      </MarketingSection>
    </MarketingLayout>
  );
}

function LegalContent({
  sections,
}: {
  sections: Array<{ title: string; body: string }>;
}) {
  return (
    <div className="grid max-w-4xl gap-4">
      {sections.map((section) => (
        <article className="rounded-md border border-border bg-white p-5" key={section.title}>
          <h2 className="text-headline font-semibold text-[#2F4B4F]">{section.title}</h2>
          <p className="mt-2 text-callout leading-7 text-text-secondary">{section.body}</p>
        </article>
      ))}
    </div>
  );
}
