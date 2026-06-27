import { MarketingLayout } from "./components";

export function PrivacyPage() {
  return (
    <MarketingLayout>
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:py-20">
          <p className="text-subheadline font-semibold text-primary">
            Privacy Policy
          </p>
          <h1 className="mt-3 text-[38px] font-bold leading-[1.05] text-[#2F4B4F] sm:text-[52px]">
            How Piya handles information
          </h1>
          <p className="mt-5 text-callout leading-8 text-text-secondary">
            Last updated: June 27, 2026
          </p>

          <div className="mt-10 space-y-8 text-callout leading-8 text-text-secondary">
            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Who we are
              </h2>
              <p className="mt-3">
                Piya is a customer relationship, campaign, loyalty, and
                communication workspace operated by F&amp;P Yina Stores LTD.
                You can reach us at{" "}
                <a
                  className="font-semibold text-primary underline underline-offset-4"
                  href="mailto:support@piya.store"
                >
                  support@piya.store
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Information we collect
              </h2>
              <p className="mt-3">
                We collect the information needed to create accounts, operate
                Piya, provide support, and protect the service. This may include:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Account details such as name, email, phone number, and role.</li>
                <li>Business profile details such as business name, locations, and channels.</li>
                <li>Customer records added by a business, including names, contact details, tags, dates, preferences, and message history.</li>
                <li>Campaign, offer, loyalty, product, service, and communication settings.</li>
                <li>Support messages and basic technical information such as device, browser, log, and security data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                How we use information
              </h2>
              <p className="mt-3">
                We use information to provide the Piya service, manage business
                accounts, process customer communication workflows, deliver
                support, improve reliability, prevent misuse, secure accounts,
                and meet legal or regulatory obligations.
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Customer contact data
              </h2>
              <p className="mt-3">
                Businesses control the customer data they add to Piya. Each
                business is responsible for having the right permission or lawful
                basis to store customer details and contact customers through
                WhatsApp, email, SMS, the customer app, or any other connected
                channel.
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Sharing information
              </h2>
              <p className="mt-3">
                We may share information with service providers that help us host
                the product, deliver messages, process payments, provide support,
                monitor reliability, or protect the service. We may also share
                information if required by law, to enforce our terms, or to
                protect users, customers, Piya, or the public.
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Retention and security
              </h2>
              <p className="mt-3">
                We keep information for as long as needed to provide Piya,
                comply with legal obligations, resolve disputes, and maintain
                security. We use administrative, technical, and organizational
                safeguards designed to protect information, but no online service
                can guarantee complete security.
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Your choices
              </h2>
              <p className="mt-3">
                You may ask us to access, correct, update, export, restrict, or
                delete personal information where those rights apply. We may need
                to verify your request and may retain information where required
                for legal, security, or legitimate business reasons.
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Updates
              </h2>
              <p className="mt-3">
                We may update this policy as Piya changes. If an update is
                material, we will take reasonable steps to let users know through
                the product, website, or email.
              </p>
            </section>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
