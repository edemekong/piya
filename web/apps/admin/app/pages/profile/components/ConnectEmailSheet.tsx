import * as React from "react";
import { AppSheet, Button } from "@yinapp/ui";

type ConnectEmailSheetProps = {
  onClose: () => void;
  open: boolean;
};

function ConnectEmailSheet({ onClose, open }: ConnectEmailSheetProps) {
  const [emailSubdomain, setEmailSubdomain] = React.useState("mail");
  const emailDomain = `${emailSubdomain || "mail"}.yourbusiness.com`;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onClose();
  }

  return (
    <AppSheet
      ariaLabel="connect email"
      description="Add the email domain Yinapp should use when sending customer emails for your business."
      footer={
        <>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button form="connect-email-form" type="submit">
            Connect email
          </Button>
        </>
      }
      onClose={onClose}
      open={open}
      title="Connect email"
    >
      <form
        className="grid gap-5"
        id="connect-email-form"
        onSubmit={handleSubmit}
      >
        <label className="grid gap-2">
          <span className="text-footnote font-semibold text-[#2F4B4F]">
            Sender name
          </span>
          <input
            className="h-12 rounded-sm border border-border bg-fill px-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
            name="senderName"
            placeholder="Your Business"
            required
            type="text"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-footnote font-semibold text-[#2F4B4F]">
            Email subdomain
          </span>
          <div className="flex h-12 overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white">
            <input
              className="min-w-0 flex-1 bg-transparent px-3 text-callout text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40"
              name="emailSubdomain"
              onChange={(event) => setEmailSubdomain(event.target.value)}
              pattern="[A-Za-z0-9-]+"
              placeholder="mail"
              required
              type="text"
              value={emailSubdomain}
            />
            <span className="flex items-center border-l border-border px-3 text-callout text-[#2F4B4F]/65">
              .yourbusiness.com
            </span>
          </div>
        </label>

        <label className="grid gap-2">
          <span className="text-footnote font-semibold text-[#2F4B4F]">
            Sender email
          </span>
          <div className="flex h-12 overflow-hidden rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white">
            <input
              className="min-w-0 flex-1 bg-transparent px-3 text-callout text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40"
              name="senderPrefix"
              pattern="[^@\s]+"
              placeholder="hello"
              required
              type="text"
            />
            <span className="flex items-center border-l border-border px-3 text-callout text-[#2F4B4F]/65">
              @{emailDomain}
            </span>
          </div>
        </label>
      </form>
    </AppSheet>
  );
}

export { ConnectEmailSheet };
