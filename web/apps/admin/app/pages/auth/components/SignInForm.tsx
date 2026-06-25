import { ArrowRight } from "lucide-react";
import { Button } from "@piya/ui";

export function SignInForm() {
  return (
    <div className="w-full max-w-[420px] text-left">
      <div className="space-y-8">
        <div className="text-title3 font-semibold text-[#102F34]">Piya</div>
        <h1 className="text-title1 font-semibold text-[#102F34]">
          Welcome to Piya
        </h1>
      </div>

      <form className="mt-12 space-y-6">
        <input
          className="h-12 w-full rounded-sm border border-border bg-fill px-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
          placeholder="Enter your email"
          type="email"
        />

        <Button className="w-full" trailing={<ArrowRight />} type="submit">
          Continue
        </Button>
      </form>
    </div>
  );
}
