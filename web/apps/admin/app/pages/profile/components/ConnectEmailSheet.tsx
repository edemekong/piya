import * as React from "react";
import {
  getBusinessSlug,
  type AccountSetupEmailIntegrationInput,
  useLazyCheckBusinessSlugAvailabilityQuery,
} from "@piya/shared";
import { AppSheet, AppTextField, Button } from "@piya/ui";

type SlugAvailabilityStatus =
  | "idle"
  | "checking"
  | "available"
  | "unavailable"
  | "error";

type ConnectEmailSheetProps = {
  businessName: string;
  initialFromEmailLocalPart: string;
  initialReplyToEmail: string;
  onClose: () => void;
  onConnect: (
    input: AccountSetupEmailIntegrationInput,
  ) => Promise<void> | void;
  open: boolean;
};

function ConnectEmailSheet({
  businessName,
  initialFromEmailLocalPart,
  initialReplyToEmail,
  onClose,
  onConnect,
  open,
}: ConnectEmailSheetProps) {
  const [fromEmailLocalPart, setFromEmailLocalPart] = React.useState(
    initialFromEmailLocalPart,
  );
  const [replyToEmail, setReplyToEmail] = React.useState(initialReplyToEmail);
  const [availabilityStatus, setAvailabilityStatus] =
    React.useState<SlugAvailabilityStatus>("idle");
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [replyToError, setReplyToError] = React.useState<string>();
  const [submissionError, setSubmissionError] = React.useState<string>();
  const replyToInputRef = React.useRef<HTMLInputElement>(null);
  const [checkSlugAvailability] =
    useLazyCheckBusinessSlugAvailabilityQuery();

  React.useEffect(() => {
    if (!open) return;

    setFromEmailLocalPart(initialFromEmailLocalPart);
    setReplyToEmail(initialReplyToEmail);
    setAvailabilityStatus("idle");
    setIsConnecting(false);
    setReplyToError(undefined);
    setSubmissionError(undefined);
  }, [initialFromEmailLocalPart, initialReplyToEmail, open]);

  React.useEffect(() => {
    if (!open || !fromEmailLocalPart) {
      setAvailabilityStatus("idle");
      return;
    }

    let cancelled = false;
    setAvailabilityStatus("checking");
    setSubmissionError(undefined);

    const timeoutId = window.setTimeout(() => {
      void checkSlugAvailability(fromEmailLocalPart)
        .unwrap()
        .then((result) => {
          if (cancelled) return;
          setAvailabilityStatus(
            result.available ? "available" : "unavailable",
          );
        })
        .catch(() => {
          if (!cancelled) setAvailabilityStatus("error");
        });
    }, 800);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [checkSlugAvailability, fromEmailLocalPart, open]);

  async function connectEmail() {
    const nextFromEmailLocalPart = getBusinessSlug(fromEmailLocalPart);
    const nextReplyToError = replyToInputRef.current
      ? getReplyToEmailError(replyToInputRef.current)
      : "Enter a valid reply-to email address.";
    if (
      !nextFromEmailLocalPart ||
      availabilityStatus !== "available" ||
      isConnecting
    ) {
      return;
    }
    if (nextReplyToError) {
      setReplyToError(nextReplyToError);
      return;
    }

    setIsConnecting(true);
    setReplyToError(undefined);
    setSubmissionError(undefined);

    try {
      await onConnect({
        fromEmailLocalPart: nextFromEmailLocalPart,
        replyToEmail: replyToEmail.trim().toLowerCase(),
      });
      onClose();
    } catch (error) {
      setSubmissionError(
        getErrorMessage(error, "Unable to connect this email."),
      );
    } finally {
      setIsConnecting(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter") return;

    event.preventDefault();
    void connectEmail();
  }

  const prefixError =
    submissionError ??
    (availabilityStatus === "unavailable"
      ? "This email prefix is not available."
      : availabilityStatus === "error"
        ? "Unable to check this email prefix. Please try again."
        : undefined);
  const prefixSuccess =
    availabilityStatus === "available"
      ? "This email prefix is available."
      : undefined;

  return (
    <AppSheet
      ariaLabel="connect email"
      footer={
        <>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button
            buttonState={isConnecting ? "loading" : "enabled"}
            disabled={
              availabilityStatus !== "available" || !replyToEmail.trim()
            }
            onClick={() => void connectEmail()}
            type="button"
          >
            Connect email
          </Button>
        </>
      }
      onClose={onClose}
      open={open}
      title="Connect email"
    >
      <div
        className="grid gap-5"
        onKeyDown={handleKeyDown}
      >
        <AppTextField
          disabled
          label="From name"
          value={businessName}
        />

        <AppTextField
          error={prefixError}
          label="From email"
          maxLength={55}
          onChange={(event) => {
            const nextPrefix = getBusinessSlug(event.target.value);
            setFromEmailLocalPart(nextPrefix);
            setAvailabilityStatus(nextPrefix ? "checking" : "idle");
            setSubmissionError(undefined);
          }}
          required
          success={prefixSuccess}
          suffix={
            <span className="flex items-center border-l border-border px-3 text-callout text-[#2F4B4F]/65">
              @mail.piya.store
            </span>
          }
          value={fromEmailLocalPart}
        />
        {availabilityStatus === "checking" ? (
          <p
            aria-live="polite"
            className="-mt-3 text-footnote text-[#2F4B4F]/65"
          >
            Checking availability...
          </p>
        ) : null}

        <AppTextField
          error={replyToError}
          label="Reply-to"
          onChange={(event) => {
            setReplyToEmail(event.target.value);
            setReplyToError(getReplyToEmailError(event.currentTarget));
          }}
          onBlur={(event) =>
            setReplyToError(getReplyToEmailError(event.currentTarget))
          }
          ref={replyToInputRef}
          required
          type="email"
          value={replyToEmail}
        />
      </div>
    </AppSheet>
  );
}

function getReplyToEmailError(input: HTMLInputElement) {
  if (input.validity.valid) return undefined;
  if (input.validity.valueMissing) return "Reply-to email is required.";

  return "Enter a valid reply-to email address.";
}

function getErrorMessage(error: unknown, fallback: string) {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return error instanceof Error ? error.message : fallback;
}

export { ConnectEmailSheet };
export type { ConnectEmailSheetProps };
