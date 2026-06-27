import { Link } from "@remix-run/react";
import { ArrowRight } from "lucide-react";
import {
  AppFieldGrid,
  AppSelectField,
  AppSheet,
  AppTextareaField,
  AppTextField,
  Button,
  cn,
} from "@piya/ui";
import * as React from "react";

type MarketingLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

const demoBusinessSizeOptions = [
  { label: "Select size", value: "" },
  { label: "Just starting", value: "Just starting" },
  { label: "1-5 team members", value: "1-5 team members" },
  { label: "6-20 team members", value: "6-20 team members" },
  { label: "21-50 team members", value: "21-50 team members" },
  { label: "51+ team members", value: "51+ team members" },
] as const;

const demoFocusOptions = [
  { label: "Select focus", value: "" },
  { label: "Contacts and customer profiles", value: "Contacts and customer profiles" },
  { label: "Campaigns and messaging", value: "Campaigns and messaging" },
  { label: "Loyalty, discounts, and gifts", value: "Loyalty, discounts, and gifts" },
  { label: "WhatsApp, email, and SMS channels", value: "WhatsApp, email, and SMS channels" },
  { label: "Full customer operations", value: "Full customer operations" },
] as const;

export function MarketingLayout({ children, className }: MarketingLayoutProps) {
  const [isDemoSheetOpen, setIsDemoSheetOpen] = React.useState(false);

  function submitDemoRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const body = [
      ["Name", formData.get("fullName")],
      ["Work email", formData.get("workEmail")],
      ["Business name", formData.get("businessName")],
      ["Phone or WhatsApp", formData.get("phone")],
      ["Business size", formData.get("businessSize")],
      ["Demo focus", formData.get("demoFocus")],
      ["Notes", formData.get("notes")],
    ]
      .map(([label, value]) => `${label}: ${String(value ?? "").trim()}`)
      .join("\n");

    window.location.href = `mailto:support@piya.store?subject=${encodeURIComponent(
      "Request a Piya demo",
    )}&body=${encodeURIComponent(body)}`;
    setIsDemoSheetOpen(false);
  }

  return (
    <main className={cn("min-h-screen bg-background text-foreground", className)}>
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6">
          <Link aria-label="Piya home" className="min-w-0" to="/">
            <PiyaLogo />
          </Link>

          <div className="flex items-center gap-3">
            <a
              className="hidden text-subheadline font-semibold text-primary underline underline-offset-4 transition hover:text-primary-dark sm:inline-flex"
              href="https://dashboard.piya.store"
            >
              Get started
            </a>
            <Button onClick={() => setIsDemoSheetOpen(true)} size="sm" type="button">
              Request a demo
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-border bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-6 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <PiyaLogo />
              <p className="text-footnote font-semibold text-text-secondary">
                by F&P Yina Stores LTD
              </p>
            </div>
            <p className="mt-4 max-w-md text-callout leading-7 text-text-secondary">
              Contact management, campaigns, loyalty, scheduled customer messages,
              and conversation history for growing businesses.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <FooterColumn
              links={[
                { label: "Home", href: "/" },
                { label: "Contact", href: "/contact" },
              ]}
              title="Company"
            />
            <FooterColumn
              links={[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ]}
              title="Legal"
            />
            <div>
              <p className="text-callout font-semibold text-[#2F4B4F]">Support</p>
              <a
                className="mt-3 inline-flex text-subheadline font-semibold text-primary underline underline-offset-4"
                href="mailto:support@piya.store"
              >
                support@piya.store
              </a>
            </div>
          </div>
        </div>
      </footer>

      <AppSheet
        ariaLabel="request a demo"
        description="Share a few details so we can prepare the right walkthrough."
        footer={
          <>
            <Button
              onClick={() => setIsDemoSheetOpen(false)}
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
            <Button form="demo-request-form" type="submit">
              Send request
            </Button>
          </>
        }
        onClose={() => setIsDemoSheetOpen(false)}
        open={isDemoSheetOpen}
        title="Request a demo"
      >
        <form
          className="grid gap-5"
          id="demo-request-form"
          onSubmit={submitDemoRequest}
        >
          <AppFieldGrid>
            <AppTextField
              autoComplete="name"
              label="Name"
              name="fullName"
              placeholder="Your name"
              required
            />
            <AppTextField
              autoComplete="email"
              label="Work email"
              name="workEmail"
              placeholder="you@example.com"
              required
              type="email"
            />
          </AppFieldGrid>
          <AppTextField
            autoComplete="organization"
            label="Business name"
            name="businessName"
            placeholder="Your business"
            required
          />
          <AppFieldGrid>
            <AppTextField
              autoComplete="tel"
              label="Phone or WhatsApp"
              name="phone"
              placeholder="+234..."
              type="tel"
            />
            <AppSelectField
              label="Business size"
              name="businessSize"
              options={demoBusinessSizeOptions}
            />
          </AppFieldGrid>
          <AppSelectField
            label="Demo focus"
            name="demoFocus"
            options={demoFocusOptions}
            required
          />
          <AppTextareaField
            label="Notes"
            name="notes"
            placeholder="Preferred day or time, current tools, or what you want to solve."
          />
        </form>
      </AppSheet>
    </main>
  );
}

export function PiyaLogo({
  centered = false,
  size = "default",
}: {
  centered?: boolean;
  size?: "default" | "hero";
}) {
  return (
    <div className={cn("flex items-center", centered && "justify-center")}>
      <img
        alt="Piya"
        className={cn(
          "h-6 w-auto object-contain",
          size === "hero" && "h-4 sm:h-6",
        )}
        src="/assets/logo-text-dark.png"
      />
    </div>
  );
}

function FooterColumn({
  links,
  title,
}: {
  links: Array<{ label: string; href: string }>;
  title: string;
}) {
  return (
    <div>
      <p className="text-callout font-semibold text-[#2F4B4F]">{title}</p>
      <div className="mt-3 grid gap-2 text-subheadline text-text-secondary">
        {links.map((link) => (
          <Link className="transition hover:text-primary" key={link.href} to={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
