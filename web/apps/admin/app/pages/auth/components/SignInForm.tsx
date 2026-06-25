import { Mail } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@piya/ui";

const otpLength = 6;

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(""));
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!showOtp) {
      setShowOtp(true);
      window.setTimeout(() => otpInputRefs.current[0]?.focus(), 0);
      return;
    }
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);

    setOtp((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });

    if (digit && index < otpLength - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="w-full max-w-[420px] text-left">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img
              alt="Piya"
              className="size-9 shrink-0 rounded-md object-contain"
              src="/assets/logo-secondary.png"
            />
            <h1 className="text-title1 font-semibold text-[#102F34]">
              Welcome to Piya
            </h1>
          </div>
          <p className="text-callout leading-relaxed text-text-secondary">
            Sign in to manage your store, customers, orders, and campaigns.
          </p>
        </div>
      </div>

      <form className="mt-12 space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-text-tertiary" />
          <input
            className="h-12 w-full rounded-sm border border-border bg-fill py-0 pl-10 pr-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
            type="email"
            value={email}
          />
        </div>

        {showOtp ? (
          <div className="space-y-3">
            <p className="text-footnote leading-relaxed text-text-secondary">
              Enter the 6-digit code sent to {email}.
            </p>
            <div className="grid grid-cols-6 gap-2">
              {otp.map((digit, index) => (
                <input
                  aria-label={`OTP digit ${index + 1}`}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  className="aspect-square w-full rounded-sm border border-border bg-fill text-center text-title3 font-semibold text-[#2F4B4F] outline-none transition focus:border-primary focus:bg-white"
                  inputMode="numeric"
                  key={index}
                  maxLength={1}
                  onChange={(event) => handleOtpChange(index, event.target.value)}
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  ref={(element) => {
                    otpInputRefs.current[index] = element;
                  }}
                  type="text"
                  value={digit}
                />
              ))}
            </div>
          </div>
        ) : null}

        <Button className="w-full" type="submit">
          {showOtp ? "Verify" : "Continue"}
        </Button>
      </form>
    </div>
  );
}
