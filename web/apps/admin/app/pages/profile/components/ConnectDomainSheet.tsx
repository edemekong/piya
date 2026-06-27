import * as React from "react";
import {
  getBusinessSlug,
  useLazyCheckBusinessSlugAvailabilityQuery,
} from "@piya/shared";
import {
  AppSheet,
  AppTextField,
  Button,
  SegmentedTabs,
} from "@piya/ui";

type DomainTab = "piya-subdomain" | "custom-domain";
type SlugAvailabilityStatus =
  | "idle"
  | "checking"
  | "available"
  | "unavailable"
  | "error";

type ConnectDomainSheetProps = {
  initialSlug: string;
  onClose: () => void;
  onConnect: (slug: string) => Promise<void> | void;
  open: boolean;
};

const domainTabs = [
  { label: "Piya Sub-Domain", value: "piya-subdomain" },
  { disabled: true, label: "Custom Domain", value: "custom-domain" },
] satisfies {
  disabled?: boolean;
  label: string;
  value: DomainTab;
}[];

function ConnectDomainSheet({
  initialSlug,
  onClose,
  onConnect,
  open,
}: ConnectDomainSheetProps) {
  const [activeTab, setActiveTab] = React.useState<DomainTab>("piya-subdomain");
  const [slug, setSlug] = React.useState(initialSlug);
  const [availabilityStatus, setAvailabilityStatus] =
    React.useState<SlugAvailabilityStatus>("idle");
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [submissionError, setSubmissionError] = React.useState<string>();
  const [checkSlugAvailability] =
    useLazyCheckBusinessSlugAvailabilityQuery();

  React.useEffect(() => {
    if (!open) return;

    setActiveTab("piya-subdomain");
    setSlug(initialSlug);
    setAvailabilityStatus("idle");
    setIsConnecting(false);
    setSubmissionError(undefined);
  }, [initialSlug, open]);

  React.useEffect(() => {
    if (!open || !slug) {
      setAvailabilityStatus("idle");
      return;
    }

    let cancelled = false;
    setAvailabilityStatus("checking");
    setSubmissionError(undefined);

    const timeoutId = window.setTimeout(() => {
      void checkSlugAvailability(slug)
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
  }, [checkSlugAvailability, open, slug]);

  async function connectDomain() {
    const nextSlug = getBusinessSlug(slug);
    if (!nextSlug || availabilityStatus !== "available" || isConnecting) {
      return;
    }

    setIsConnecting(true);
    setSubmissionError(undefined);

    try {
      await onConnect(nextSlug);
      onClose();
    } catch (error) {
      setSubmissionError(
        getErrorMessage(error, "Unable to connect this domain."),
      );
    } finally {
      setIsConnecting(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter") return;

    event.preventDefault();
    void connectDomain();
  }

  const validationError =
    submissionError ??
    (availabilityStatus === "unavailable"
      ? "This Piya sub-domain is not available."
      : availabilityStatus === "error"
        ? "Unable to check this Piya sub-domain. Please try again."
        : undefined);
  const validationSuccess =
    availabilityStatus === "available"
      ? "This Piya sub-domain is available."
      : undefined;

  return (
    <AppSheet
      ariaLabel="connect domain"
      footer={
        <>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button
            buttonState={isConnecting ? "loading" : "enabled"}
            disabled={availabilityStatus !== "available"}
            onClick={() => void connectDomain()}
            type="button"
          >
            Connect domain
          </Button>
        </>
      }
      onClose={onClose}
      open={open}
      title="Connect domain"
    >
      <div
        className="grid gap-5"
        onKeyDown={handleKeyDown}
      >
        <SegmentedTabs
          items={domainTabs}
          onValueChange={setActiveTab}
          value={activeTab}
        />

        <AppTextField
          error={validationError}
          label="Piya sub-domain"
          maxLength={55}
          onChange={(event) => {
            const nextSlug = getBusinessSlug(event.target.value);
            setSlug(nextSlug);
            setAvailabilityStatus(nextSlug ? "checking" : "idle");
            setSubmissionError(undefined);
          }}
          required
          success={validationSuccess}
          suffix={
            <span className="flex items-center border-l border-border px-3 text-callout text-[#2F4B4F]/65">
              .piya.store
            </span>
          }
          value={slug}
        />
        {availabilityStatus === "checking" ? (
          <p
            aria-live="polite"
            className="-mt-3 text-footnote text-[#2F4B4F]/65"
          >
            Checking availability...
          </p>
        ) : null}

        <ul className="list-disc pl-5 text-callout text-[#2F4B4F]/65">
          <li>
            You will also have{" "}
            <span className="font-semibold text-[#2F4B4F]">
              https://piya.store/{slug || "name"}
            </span>
          </li>
        </ul>
      </div>
    </AppSheet>
  );
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

export { ConnectDomainSheet };
export type { ConnectDomainSheetProps };
