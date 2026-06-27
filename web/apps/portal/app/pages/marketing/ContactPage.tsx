import { Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@piya/ui";
import type * as React from "react";
import { MarketingLayout, MarketingSection } from "./components";

export function ContactPage() {
  return (
    <MarketingLayout>
      <MarketingSection
        className="border-t-0"
        description="Contact Piya for account setup, product questions, support requests, or privacy and legal inquiries."
        eyebrow="Contact"
        title="Get in touch with Piya"
      >
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-md border border-border bg-white p-6">
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

          <div className="grid gap-4">
            <ContactNote
              icon={<MessageCircle className="size-5" />}
              title="What to include"
              value="Tell us your business name, the channel or product area involved, and the best way to reach you."
            />
            <ContactNote
              icon={<MapPin className="size-5" />}
              title="Operator"
              value="Piya is operated by Yina Store Ltd."
            />
          </div>
        </div>
      </MarketingSection>
    </MarketingLayout>
  );
}

function ContactNote({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border bg-white p-5">
      <div className="flex items-center gap-3 text-primary">
        {icon}
        <h2 className="text-headline font-semibold text-[#2F4B4F]">{title}</h2>
      </div>
      <p className="mt-3 text-callout leading-7 text-text-secondary">{value}</p>
    </div>
  );
}
