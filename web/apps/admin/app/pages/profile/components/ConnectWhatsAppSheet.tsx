import * as React from "react";
import { ExternalLink, Unplug } from "lucide-react";
import {
  appConfig,
  formatDate,
  type WhatsAppChannelSettings,
} from "@piya/shared";
import { AppSheet, Button } from "@piya/ui";

type ConnectWhatsAppSheetProps = {
  connection?: WhatsAppChannelSettings | null;
  isDisconnecting?: boolean;
  onClose: () => void;
  onDisconnect: () => Promise<unknown> | unknown;
  open: boolean;
};

function ConnectWhatsAppSheet({
  connection,
  isDisconnecting = false,
  onClose,
  onDisconnect,
  open,
}: ConnectWhatsAppSheetProps) {
  const [error, setError] = React.useState<string>();
  const isConnected =
    connection?.status === "active" && Boolean(connection.phoneNumberId);

  React.useEffect(() => {
    if (open) setError(undefined);
  }, [open]);

  function handleConnectWhatsApp() {
    const signupUrl = getEmbeddedSignupUrl();
    if (!signupUrl) {
      setError("WhatsApp Embedded Signup is not configured yet.");
      return;
    }

    window.open(signupUrl, "_blank", "noopener,noreferrer");
  }

  async function disconnectWhatsApp() {
    setError(undefined);

    try {
      await onDisconnect();
      onClose();
    } catch (disconnectError) {
      setError(
        disconnectError instanceof Error
          ? disconnectError.message
          : "Unable to disconnect WhatsApp.",
      );
    }
  }

  return (
    <AppSheet
      ariaLabel="connect WhatsApp"
      description="Connect a WhatsApp Business number so customers can receive messages and reply back."
      footer={
        <>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          {isConnected ? (
            <Button
              buttonState={isDisconnecting ? "loading" : "enabled"}
              icon={<Unplug />}
              onClick={() => void disconnectWhatsApp()}
              type="button"
              variant="outline"
            >
              Disconnect
            </Button>
          ) : null}
          <Button
            icon={<ExternalLink />}
            onClick={handleConnectWhatsApp}
            type="button"
          >
            {isConnected ? "Reconnect with Meta" : "Continue with Meta"}
          </Button>
        </>
      }
      onClose={onClose}
      open={open}
      title="Connect WhatsApp"
    >
      <div className="grid gap-4">
        {connection ? (
          <div className="rounded-md border border-border bg-fill p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-[#2F4B4F]">
                  {connection.displayPhoneNumber ??
                    connection.phoneNumber ??
                    "WhatsApp number"}
                </p>
                <p className="mt-1 text-callout text-[#2F4B4F]/65">
                  WABA {connection.wabaId ?? connection.businessAccountId ?? "-"}
                </p>
              </div>
              <span className={statusClassName(connection.status)}>
                {getStatusLabel(connection.status)}
              </span>
            </div>
            <div className="mt-4 grid gap-2 text-callout text-[#2F4B4F]/70">
              <p>Phone number ID: {connection.phoneNumberId ?? "-"}</p>
              <p>Last sync: {formatDate(connection.lastSyncedAt)}</p>
              {connection.lastError ? (
                <p className="text-error">{connection.lastError}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        {error ? (
          <p className="rounded-md border border-error/30 bg-error/10 p-3 text-callout text-error">
            {error}
          </p>
        ) : null}

        <div className="rounded-md border border-border p-4">
          <div className="relative grid gap-5 pl-10">
            <div className="absolute bottom-6 left-4 top-6 w-px bg-border" />

            <div className="relative">
              <span className="absolute -left-10 flex size-8 items-center justify-center rounded-full bg-secondary text-footnote font-semibold text-primary">
                1
              </span>
              <p className="font-semibold text-[#2F4B4F]">
                Connect through Meta
              </p>
              <p className="mt-1 text-callout text-[#2F4B4F]/65">
                You will sign in with Meta, choose or create a WhatsApp
                Business account, and select the phone number customers will
                message.
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-10 flex size-8 items-center justify-center rounded-full bg-secondary text-footnote font-semibold text-primary">
                2
              </span>
              <p className="font-semibold text-[#2F4B4F]">After connection</p>
              <p className="mt-1 text-callout text-[#2F4B4F]/65">
                Piya will save the approved business account, phone number, and
                secure connection details so customer replies can come back into
                the app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppSheet>
  );
}

function getEmbeddedSignupUrl() {
  const { metaAppId, whatsappEmbeddedSignupConfigId, whatsappRedirectUri } =
    appConfig;
  if (!metaAppId || !whatsappEmbeddedSignupConfigId || !whatsappRedirectUri) {
    return null;
  }

  const url = new URL("https://business.facebook.com/messaging/whatsapp/onboard/");
  url.searchParams.set("app_id", metaAppId);
  url.searchParams.set("config_id", whatsappEmbeddedSignupConfigId);
  url.searchParams.set(
    "extras",
    JSON.stringify({
      featureType: "whatsapp_business_app_onboarding",
      sessionInfoVersion: "3",
      version: "v4",
    }),
  );
  url.searchParams.set("redirect_uri", whatsappRedirectUri);
  return url.toString();
}

function getStatusLabel(status: WhatsAppChannelSettings["status"]) {
  switch (status) {
    case "active":
      return "Connected";
    case "connecting":
    case "pending":
      return "Connecting";
    case "failed":
      return "Failed";
    case "reconnect_required":
      return "Reconnect required";
    case "disabled":
      return "Disconnected";
    case "not_connected":
    default:
      return "Not connected";
  }
}

function statusClassName(status: WhatsAppChannelSettings["status"]) {
  const base =
    "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-footnote font-semibold";

  if (status === "active") {
    return `${base} bg-secondary text-primary`;
  }

  if (status === "failed" || status === "reconnect_required") {
    return `${base} bg-error/10 text-error`;
  }

  return `${base} bg-surface-tertiary text-[#2F4B4F]/75`;
}

export { ConnectWhatsAppSheet };
