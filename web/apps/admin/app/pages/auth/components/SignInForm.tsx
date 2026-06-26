import { Mail } from "lucide-react";
import type * as React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { ApiServiceError, authService, userService } from "@piya/shared";
import { Button } from "@piya/ui";

const otpLength = 6;

export function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(otpLength).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const otpCode = otp.join("");
  const normalizedEmail = email.trim().toLowerCase();
  const canSubmit = showOtp
    ? otpCode.length === otpLength && !isSubmitting
    : normalizedEmail.length > 0 && !isSubmitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      if (!showOtp) {
        await authService.requestOTP({ phoneOrEmail: normalizedEmail });
        setShowOtp(true);
        window.setTimeout(() => otpInputRefs.current[0]?.focus(), 0);
        return;
      }

      await authService.verifyOTP({
        code: otpCode,
        isPhone: false,
        phoneOrEmail: normalizedEmail,
      });

      const uid = authService.currentFirebaseUser?.uid;
      if (!uid) {
        throw new Error("Unable to confirm your signed-in session.");
      }

      const hasUserProfile = await currentUserProfileExists(uid);
      if (!hasUserProfile) {
        await userService.createUser({});
      }

      navigate(hasUserProfile ? "/overview" : "/account-setup", {
        replace: true,
      });
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
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

  function handleOtpPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, otpLength);

    if (!digits) return;

    event.preventDefault();
    setOtp(
      Array.from({ length: otpLength }, (_, index) => digits[index] ?? ""),
    );
    window.setTimeout(() => {
      const nextIndex = Math.min(digits.length, otpLength) - 1;
      otpInputRefs.current[nextIndex]?.focus();
    }, 0);
  }

  function handleChangeEmail() {
    setShowOtp(false);
    setOtp(Array(otpLength).fill(""));
    setFormError("");
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
            Sign in or register to manage your store, customers, orders, and
            campaigns.
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
                  onPaste={handleOtpPaste}
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

        {formError ? (
          <p className="text-footnote leading-relaxed text-red-600" role="alert">
            {formError}
          </p>
        ) : null}

        <Button className="w-full" disabled={!canSubmit} type="submit">
          {isSubmitting ? "Please wait..." : showOtp ? "Verify" : "Continue"}
        </Button>

        {showOtp ? (
          <button
            className="w-full text-center text-footnote font-semibold text-primary underline underline-offset-4"
            onClick={handleChangeEmail}
            type="button"
          >
            Use a different email
          </button>
        ) : null}
      </form>
    </div>
  );
}

async function currentUserProfileExists(uid: string) {
  try {
    await userService.getUser(uid);
    return true;
  } catch (error) {
    if (error instanceof ApiServiceError && error.code === "USER_NOT_FOUND") {
      return false;
    }

    throw error;
  }
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof ApiServiceError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to sign in. Please try again.";
}
