import { Link } from "@remix-run/react";
import { ArrowRight } from "lucide-react";
import { Button, cn } from "@piya/ui";
import type * as React from "react";

type MarketingLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function MarketingLayout({ children, className }: MarketingLayoutProps) {
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
              href="mailto:support@piya.store?subject=Create%20a%20Piya%20account"
            >
              Get started
            </a>
            <Button asChild size="sm">
              <a href="mailto:support@piya.store?subject=Request%20a%20Piya%20demo">
                Request a demo
                <ArrowRight className="size-4" />
              </a>
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
