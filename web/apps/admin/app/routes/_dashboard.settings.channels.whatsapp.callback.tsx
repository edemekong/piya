import * as React from "react";
import type { MetaFunction } from "@remix-run/node";
import { Link, useSearchParams } from "@remix-run/react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  type CompleteWhatsAppConnectionInput,
  useCompleteWhatsAppConnectionMutation,
} from "@piya/shared";
import { Button, SettingsCard } from "@piya/ui";

export const meta: MetaFunction = () => [
  { title: "WhatsApp connection | Piya" },
];

type CallbackState = "checking" | "saving" | "connected" | "incomplete" | "failed";

export default function WhatsAppCallbackRoute() {
  const [searchParams] = useSearchParams();
  const [completeConnection] = useCompleteWhatsAppConnectionMutation();
  const [state, setState] = React.useState<CallbackState>("checking");
  const [message, setMessage] = React.useState(
    "Reading the WhatsApp connection response from Meta.",
  );

  React.useEffect(() => {
    const error = searchParams.get("error") ?? searchParams.get("error_message");
    if (error) {
      setState("failed");
      setMessage(error);
      return;
    }

    const input = getConnectionInput(searchParams);
    if (!input) {
      setState("incomplete");
      setMessage(
        "Meta returned this callback without the WhatsApp Business Account and phone number details needed to finish the connection.",
      );
      return;
    }

    setState("saving");
    setMessage("Saving the WhatsApp Business Account and phone number.");
    void completeConnection(input)
      .unwrap()
      .then(() => {
        setState("connected");
        setMessage("WhatsApp is connected for this business.");
      })
      .catch((saveError) => {
        setState("failed");
        setMessage(
          saveError instanceof Error
            ? saveError.message
            : "Unable to save the WhatsApp connection.",
        );
      });
  }, [completeConnection, searchParams]);

  const isLoading = state === "checking" || state === "saving";
  const isSuccess = state === "connected";

  return (
    <div className="grid gap-6">
      <header className="rounded-md bg-white p-6 shadow-sm">
        <h1 className="text-title-1 font-semibold text-[#2F4B4F]">
          WhatsApp connection
        </h1>
        <p className="mt-2 max-w-2xl text-callout text-[#2F4B4F]/75">
          Complete the WhatsApp Business connection after Meta onboarding.
        </p>
      </header>

      <section className="rounded-md bg-white p-6 shadow-sm">
        <SettingsCard title="Connection status">
          <div className="flex items-start gap-3">
            <span className={iconClassName(state)}>
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : isSuccess ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <AlertCircle className="size-5" />
              )}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-[#2F4B4F]">
                {getStateTitle(state)}
              </p>
              <p className="mt-1 text-callout text-[#2F4B4F]/70">{message}</p>
              {state === "incomplete" ? (
                <p className="mt-3 text-callout text-[#2F4B4F]/70">
                  Meta completed the redirect, but did not include the phone
                  number details needed to save the connection.
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild type="button" variant="secondary">
              <Link to="/profile?page=channels">Back to profile</Link>
            </Button>
            {!isLoading ? (
              <Button asChild type="button">
                <Link to="/profile?page=channels">Open integrations</Link>
              </Button>
            ) : null}
          </div>
        </SettingsCard>
      </section>
    </div>
  );
}

function getConnectionInput(
  searchParams: URLSearchParams,
): CompleteWhatsAppConnectionInput | null {
  const wabaId =
    searchParams.get("waba_id") ??
    searchParams.get("wabaId") ??
    searchParams.get("business_account_id");
  const phoneNumberId =
    searchParams.get("phone_number_id") ?? searchParams.get("phoneNumberId");
  const displayPhoneNumber =
    searchParams.get("display_phone_number") ??
    searchParams.get("displayPhoneNumber") ??
    searchParams.get("phone_number") ??
    searchParams.get("phoneNumber");

  if (!wabaId || !phoneNumberId || !displayPhoneNumber) return null;

  return {
    displayName: searchParams.get("display_name"),
    displayPhoneNumber,
    phoneNumber: searchParams.get("phone_number"),
    phoneNumberId,
    qualityRating: searchParams.get("quality_rating"),
    wabaId,
  };
}

function getStateTitle(state: CallbackState) {
  switch (state) {
    case "checking":
      return "Checking response";
    case "saving":
      return "Saving connection";
    case "connected":
      return "Connected";
    case "incomplete":
      return "More setup needed";
    case "failed":
      return "Connection failed";
  }
}

function iconClassName(state: CallbackState) {
  const base = "flex size-10 shrink-0 items-center justify-center rounded-full";

  if (state === "connected") return `${base} bg-secondary text-primary`;
  if (state === "failed" || state === "incomplete") {
    return `${base} bg-error/10 text-error`;
  }

  return `${base} bg-surface-tertiary text-[#2F4B4F]/70`;
}
