import { ExternalLink } from "lucide-react";
import { AppSheet, Button } from "@piya/ui";

type ConnectWhatsAppSheetProps = {
  onClose: () => void;
  open: boolean;
};

function ConnectWhatsAppSheet({ onClose, open }: ConnectWhatsAppSheetProps) {
  function handleConnectWhatsApp() {
    onClose();
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
          <Button
            icon={<ExternalLink />}
            onClick={handleConnectWhatsApp}
            type="button"
          >
            Continue with Meta
          </Button>
        </>
      }
      onClose={onClose}
      open={open}
      title="Connect WhatsApp"
    >
      <div className="rounded-md border border-border p-4">
        <div className="relative grid gap-5 pl-10">
          <div className="absolute bottom-6 left-4 top-6 w-px bg-border" />

          <div className="relative">
            <span className="absolute -left-10 flex size-8 items-center justify-center rounded-full bg-secondary text-footnote font-semibold text-primary">
              1
            </span>
            <p className="font-semibold text-[#2F4B4F]">Connect through Meta</p>
            <p className="mt-1 text-callout text-[#2F4B4F]/65">
              You will sign in with Meta, choose or create a WhatsApp Business
              account, and select the phone number customers will message.
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
    </AppSheet>
  );
}

export { ConnectWhatsAppSheet };
