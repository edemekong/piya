import { MarketingLayout } from "./components";

export function TermsPage() {
  return (
    <MarketingLayout>
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:py-20">
          <p className="text-subheadline font-semibold text-primary">
            Terms of Service
          </p>
          <h1 className="mt-3 text-[38px] font-bold leading-[1.05] text-[#2F4B4F] sm:text-[52px]">
            Basic terms for using Piya
          </h1>
          <p className="mt-5 text-callout leading-8 text-text-secondary">
            Last updated: June 27, 2026
          </p>

          <div className="mt-10 space-y-8 text-callout leading-8 text-text-secondary">
            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                About Piya
              </h2>
              <p className="mt-3">
                Piya is a customer relationship, campaign, loyalty, and
                communication workspace operated by F&amp;P Yina Stores LTD.
                These terms explain the basic rules for using Piya.
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Accounts
              </h2>
              <p className="mt-3">
                You must provide accurate account and business information, keep
                login details secure, and make sure only authorized team members
                use your business account. You are responsible for activity under
                your account.
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Use of the service
              </h2>
              <p className="mt-3">
                You may use Piya to manage business profiles, customer contacts,
                tags, products, services, offers, campaigns, loyalty rewards,
                messages, and conversation history. You must use Piya only for
                lawful business purposes.
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Customer communications
              </h2>
              <p className="mt-3">
                You are responsible for the customer data you upload and for
                having the right permission or lawful basis to contact customers.
                This applies to WhatsApp, email, SMS, the customer app, and any
                other connected channel.
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Acceptable use
              </h2>
              <p className="mt-3">You must not use Piya to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Send unlawful, misleading, abusive, harmful, or unauthorized messages.</li>
                <li>Upload content or data that violates another person&apos;s rights.</li>
                <li>Attempt to access accounts, systems, or data without permission.</li>
                <li>Interfere with the reliability, security, or operation of Piya.</li>
                <li>Use Piya for fraud, spam, malware, harassment, or illegal activity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Third-party services
              </h2>
              <p className="mt-3">
                Piya may connect with third-party services for messaging,
                hosting, payments, analytics, support, and other product
                features. Those services may have their own terms and policies.
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Changes and availability
              </h2>
              <p className="mt-3">
                We may change, improve, suspend, or discontinue parts of Piya as
                the product develops. We aim to keep the service reliable, but we
                do not promise that every feature will always be available or
                error-free.
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Responsibility
              </h2>
              <p className="mt-3">
                Piya is provided for business use. To the extent allowed by law,
                we are not responsible for indirect losses, lost profits, lost
                revenue, lost data, or business interruption arising from use of
                the service.
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Suspension
              </h2>
              <p className="mt-3">
                We may suspend or restrict access if we believe an account is
                being used unlawfully, insecurely, abusively, or in a way that
                could harm Piya, users, customers, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-title-2 font-semibold text-[#2F4B4F]">
                Questions
              </h2>
              <p className="mt-3">
                Questions about these terms can be sent to{" "}
                <a
                  className="font-semibold text-primary underline underline-offset-4"
                  href="mailto:support@piya.store"
                >
                  support@piya.store
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
