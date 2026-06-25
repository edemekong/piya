import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@piya/ui";

export function SignInForm() {
  return (
    <div className="w-full max-w-[420px] text-left">
      <div className="space-y-6">
        <img
          alt="Piya"
          className="size-12 rounded-md object-contain"
          src="/assets/logo-secondary.png"
        />

        <div className="space-y-3">
          <h1 className="text-title1 font-semibold text-[#102F34]">
            Get started to Piya
          </h1>
          <p className="text-callout leading-relaxed text-text-secondary">
            Sign in to manage your store, customers, orders, and campaigns.
          </p>
        </div>
      </div>

      <form className="mt-12 space-y-6">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-text-tertiary" />
          <input
            className="h-12 w-full rounded-sm border border-border bg-fill py-0 pl-10 pr-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
            placeholder="Enter your email"
            type="email"
          />
        </div>

        <Button className="w-full" type="submit">
          Continue
        </Button>
      </form>
    </div>
  );
}
