import { Mail } from "lucide-react";
import { Button } from "@piya/ui";
import { MarketingLayout, MarketingSection } from "./components";

export function ContactPage() {
  return (
    <MarketingLayout>
      <MarketingSection
        className="border-t-0"
        description="Email Piya for account setup, product questions, support requests, privacy questions, or legal inquiries."
        title="Get in touch with Piya"
      >
        <div className="max-w-2xl rounded-md border border-border bg-white p-6">
          <Mail className="size-7 text-primary" />
          <h2 className="mt-5 text-title-2 font-semibold text-[#2F4B4F]">
            Email support
          </h2>
          <p className="mt-3 text-callout leading-7 text-text-secondary">
            For product support, account setup, privacy questions, or business
            review requests, email:
          </p>
          <a
            className="mt-4 inline-flex text-headline font-semibold text-primary underline underline-offset-4"
            href="mailto:support@piya.store"
          >
            support@piya.store
          </a>
          <div className="mt-6">
            <Button asChild>
              <a href="mailto:support@piya.store?subject=Piya%20support%20request">
                Email Piya
              </a>
            </Button>
          </div>
        </div>
      </MarketingSection>
    </MarketingLayout>
  );
}
